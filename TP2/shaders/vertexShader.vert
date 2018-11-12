uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;

uniform sampler2D height;

void main()
{
    vTextureCoord = aTextureCoord;

    vec3 newPos = vec3(aVertexPosition.x, aVertexPosition.y + texture2D(height, aTextureCoord)[1], aVertexPosition.z);
    gl_Position = uPMatrix * uMVMatrix * vec4(newPos,1.0);
}