import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {fragmentShaderSource, vertexShaderSource} from "./shaders";
import {createProgramFromSources, resizeCanvasToDisplaySize} from "../webGlUtils";

@Component({
    selector: "app-translation",
    templateUrl: "./translation.component.html",
    styleUrls: ["./translation.component.less"]
})
export class TranslationComponent implements OnInit {
    @ViewChild("canvas", {static: true})
    canvas: ElementRef<HTMLCanvasElement>;

    // First let's make some constiables
    // to hold the translation,
    private translation = [0, 0];
    private color = [Math.random(), Math.random(), Math.random(), 1];
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private vao: WebGLVertexArrayObject;

    constructor() {
    }

    ngOnInit(): void {
        // Get A WebGL context
        this.gl = this.canvas.nativeElement.getContext("webgl2");
        if (!this.gl) {
            return;
        }

        // Use our boilerplate utils to compile the shaders and link into a program
        this.program = createProgramFromSources(this.gl,
            [vertexShaderSource, fragmentShaderSource]);

        // look up where the vertex data needs to go.
        const positionAttributeLocation: number = this.gl.getAttribLocation(this.program, "a_position");

        // Create a buffer
        const positionBuffer: WebGLBuffer = this.gl.createBuffer();

        // Create a vertex array object (attribute state)
        this.vao = this.gl.createVertexArray();

        // and make it the one we're currently working with
        this.gl.bindVertexArray(this.vao);

        // Turn on the attribute
        this.gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        // Set Geometry.
        this.setGeometry();

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        const size = 2;          // 2 components per iteration
        const type = this.gl.FLOAT;   // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        this.drawScene();

        // Setup a ui.
        // webthis.glLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: this.gl.canvas.width});
        // webthis.glLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: this.gl.canvas.height});
    }

    updatePosition(index, value): void {
        this.translation[index] = value;
        this.drawScene();
    }

    // Draw the scene.
    private drawScene(): void {
        resizeCanvasToDisplaySize(this.gl.canvas as HTMLCanvasElement);

        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        // tslint:disable-next-line:no-bitwise
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        this.gl.useProgram(this.program);

        // Bind the attribute/buffer set we want.
        this.gl.bindVertexArray(this.vao);

        // look up uniform locations
        const resolutionUniformLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");
        const colorLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, "u_color");
        const translationLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, "u_translation");

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

        // Set the color.
        this.gl.uniform4fv(colorLocation, this.color);

        // Set the translation.
        this.gl.uniform2fv(translationLocation, this.translation);

        // Draw the geometry.
        const primitiveType = this.gl.TRIANGLES;
        // const offset = 0;
        const count = 18;
        this.gl.drawArrays(primitiveType, 0, count);
    }

    // Fill the current ARRAY_BUFFER buffer
    // with the values that define a letter 'F'.
    private setGeometry(): void {
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([
                // left column
                0, 0,
                30, 0,
                0, 150,
                0, 150,
                30, 0,
                30, 150,

                // top rung
                30, 0,
                100, 0,
                30, 30,
                30, 30,
                100, 0,
                100, 30,

                // middle rung
                30, 60,
                67, 60,
                30, 90,
                30, 90,
                67, 60,
                67, 90,
            ]),
            this.gl.STATIC_DRAW);
    }

}
