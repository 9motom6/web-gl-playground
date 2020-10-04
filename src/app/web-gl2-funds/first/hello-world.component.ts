import {Component, OnInit} from "@angular/core";

@Component({
    selector: "app-hello-world",
    templateUrl: "./hello-world.component.html",
    styleUrls: ["./hello-world.component.less"]
})
export class HelloWorldComponent implements OnInit {
    // language=GLSL
    vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;

    // language=GLSL
    fragmentShaderSource = `#version 300 es

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;

    // we need to declare an output for the fragment shader
    out vec4 outColor;

    void main() {
        // Just set the output to a constant reddish-purple
        outColor = vec4(1, 0, 0.5, 1);
    }
    `;

    constructor() {
    }

    ngOnInit(): void {
        const canvas: HTMLCanvasElement = document.querySelector("#c");

        const gl: WebGL2RenderingContext = canvas.getContext("webgl2");
        if (!gl) {
            alert("Your browser does not support WebGL2.");
            console.error("Your browser does not support WebGL2.");
        }

        const vertexShader: WebGLShader = this.createShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource);
        const fragmentShader: WebGLShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource);
        const program: WebGLProgram = this.createProgram(gl, vertexShader, fragmentShader);
        const positionAttributeLocation: number = gl.getAttribLocation(program, "a_position");
        const positionBuffer: WebGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // three 2d points
        const positions: number[] = [
            0, 0,
            0, 0.5,
            0.7, 0,
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

    }

    private createShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    private createProgram(gl: WebGL2RenderingContext, vertexShader, fragmentShader): WebGLProgram {
        const program: WebGLProgram = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}
