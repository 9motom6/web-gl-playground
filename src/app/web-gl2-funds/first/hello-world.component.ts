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

        // three 2d points
        const positions: number[] = [
            10, 20,
            80, 20,
            10, 30,
            10, 30,
            80, 20,
            80, 30,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const vao: WebGLVertexArrayObject = gl.createVertexArray();
        gl.bindVertexArray(vao);
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
        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        const primitiveType: number = gl.TRIANGLES;
        const count: number = 6;
        gl.drawArrays(primitiveType, offset, count);
    }
}
