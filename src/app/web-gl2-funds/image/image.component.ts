import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {createProgramFromSources, resizeCanvasToDisplaySize} from "../webGlUtils";
import {fragmentShaderSource, vertexShaderSource} from "./shaders";

@Component({
    selector: "app-image",
    templateUrl: "./image.component.html",
    styleUrls: ["./image.component.less"]
})
export class ImageComponent implements OnInit {
    @ViewChild("canvas", {static: true})
    canvas: ElementRef<HTMLCanvasElement>;

    constructor() {
    }

    ngOnInit(): void {
        const image = new Image();
        // image.src = "https://webgl2fundamentals.org/webgl/resources/leaves.jpg";  // MUST BE SAME DOMAIN!!!
        image.src = "assets/veigar.png";
        image.crossOrigin = "anonymous";
        image.onload = () => this.render(image);
    }

    private render(image): void {
        // Get A WebGL context
        const gl: WebGL2RenderingContext = this.canvas.nativeElement.getContext("webgl2");
        if (!gl) {
            return;
        }

        // setup GLSL program
        const program: WebGLProgram = createProgramFromSources(gl,
            [vertexShaderSource, fragmentShaderSource]);

        // look up where the vertex data needs to go.
        const positionAttributeLocation: number = gl.getAttribLocation(program, "a_position");
        const texCoordAttributeLocation: number = gl.getAttribLocation(program, "a_texCoord");

        // lookup uniforms
        const resolutionLocation: WebGLUniformLocation = gl.getUniformLocation(program, "u_resolution");
        const imageLocation: WebGLUniformLocation = gl.getUniformLocation(program, "u_image");

        // Create a vertex array object (attribute state)
        const vao: WebGLVertexArrayObject = gl.createVertexArray();

        // and make it the one we're currently working with
        gl.bindVertexArray(vao);

        // Create a buffer and put a single pixel space rectangle in
        // it (2 triangles)
        const positionBuffer: WebGLBuffer = gl.createBuffer();

        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        // const size: number = 2;          // 2 components per iteration
        // const type: number = gl.FLOAT;   // the data is 32bit floats
        // const normalize: boolean = false; // don't normalize the data
        // const stride: number = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        // const offset: number = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // provide texture coordinates for the rectangle.
        const texCoordBuffer: WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ]), gl.STATIC_DRAW);

        // Turn on the attribute
        gl.enableVertexAttribArray(texCoordAttributeLocation);

        // Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
        // let size = 2;          // 2 components per iteration
        // let type = gl.FLOAT;   // the data is 32bit floats
        // let normalize = false; // don't normalize the data
        // let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        // let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        this.createTexture(gl, image);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        // tslint:disable-next-line:no-bitwise
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // Tell the shader to get the texture from texture unit 0
        gl.uniform1i(imageLocation, 0);

        // Bind the position buffer so gl.bufferData that will be called
        // in setRectangle puts data in the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Set a rectangle the same size as the image.
        this.setRectangle(gl, 0, 0, image.width, image.height);

        // Draw the rectangle.
        const primitiveType: GLenum = gl.TRIANGLES;
        const offset: number = 0;
        const count: number = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    private createTexture(gl: WebGL2RenderingContext, image): void {
        const texture: WebGLTexture = gl.createTexture();

        // make unit 0 the active texture uint
        // (ie, the unit all other texture commands will affect
        gl.activeTexture(gl.TEXTURE0 + 0);

        // Bind it to texture unit 0' 2D bind point
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we don't need mips and so we're not filtering
        // and we don't repeat at the edges
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        const mipLevel: number = 0;               // the largest mip
        const internalFormat: number = gl.RGBA;   // format we want in the texture
        const srcFormat: number = gl.RGBA;        // format of data we are supplying
        const srcType: number = gl.UNSIGNED_BYTE; // type of data we are supplying
        gl.texImage2D(gl.TEXTURE_2D,
            mipLevel,
            internalFormat,
            srcFormat,
            srcType,
            image);
    }

    private setRectangle(gl, x, y, width, height): void {
        const x1 = x;
        const x2 = x + width;
        const y1 = y;
        const y2 = y + height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]), gl.STATIC_DRAW);
    }
}
