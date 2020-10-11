import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";
import {fragmentShaderSource, vertexShaderSource} from "./shaders";
import {clearCanvas, loadShader, createProgram, resizeCanvasToDisplaySize} from "../webGlUtils";

@Component({
    selector: "app-hello-world",
    templateUrl: "./hello-world.component.html",
    styleUrls: ["./hello-world.component.less"]
})
export class HelloWorldComponent implements AfterViewInit {
    @ViewChild("canvas", {static: true})
    canvas: ElementRef<HTMLCanvasElement>;

    constructor() {
    }

    ngAfterViewInit(): void {
        const gl: WebGL2RenderingContext = this.canvas.nativeElement.getContext("webgl2", {antialias: false});
        if (!gl) {
            alert("Your browser does not support WebGL2.");
            console.error("Your browser does not support WebGL2.");
        }
        this.canvas.nativeElement.width = 800;
        this.canvas.nativeElement.height = 600;
        const vertexShader: WebGLShader = loadShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader: WebGLShader = loadShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        const program: WebGLProgram = createProgram(gl, [vertexShader, fragmentShader]);
        const positionAttributeLocation: number = gl.getAttribLocation(program, "a_position");
        const positionBuffer: WebGLBuffer = gl.createBuffer();
        const resolutionUniformLocation: WebGLUniformLocation = gl.getUniformLocation(program, "u_resolution");
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const colorLocation = gl.getUniformLocation(program, "u_color");

        gl.enableVertexAttribArray(positionAttributeLocation);

        const size = 2;          // 2 components per iteration
        const type = gl.FLOAT;   // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);
        resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement, 1);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        clearCanvas(gl);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Pass in the canvas resolution so we can convert from
        // pixels to clip space in the shader
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // draw 50 random rectangles in random colors
        for (let ii = 0; ii < 50; ++ii) {
            this.drawRandomRect(gl, colorLocation, offset);
        }
    }

    private drawRandomRect(gl: WebGL2RenderingContext, colorLocation: WebGLUniformLocation, offset: number): void {
        // Put a rectangle in the position buffer
        this.setRectangle(
            gl, this.randomInt(300), this.randomInt(300), this.randomInt(300), this.randomInt(300));

        // Set a random color.
        gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

        // Draw the rectangle.
        const primitiveType = gl.TRIANGLES;
        // const offset = 0;
        const count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

// Returns a random integer from 0 to range - 1.
    private randomInt(range: number): number {
        return Math.floor(Math.random() * range);
    }

    // Fill the buffer with the values that define a rectangle.
    private setRectangle(gl, x, y, width, height): void {
        let x1 = x;
        let x2 = x + width;
        let y1 = y;
        let y2 = y + height;
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

