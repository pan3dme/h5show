

class ProdkarenModelShader extends Shader3D {
    static ProdkarenModelShader: string = "ProdkarenModelShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "vPosition");
        $context.bindAttribLocation(this.program, 1, "vTexCoord");
        $context.bindAttribLocation(this.program, 2, "vTangent");
        $context.bindAttribLocation(this.program, 3, "vBitangent");
        $context.bindAttribLocation(this.program, 4, "vNormal");


    }
    getVertexShaderString(): string {
        var $str: string =
            "#define MOBILE\n" +
            "#define NOBLEND\n" +
            "#define SHADOW_COUNT 3\n" +
            "#define LIGHT_COUNT 3\n" +
            "precision highp float;\n" +
            "uniform mat4 uModelViewProjectionMatrix;\n" +
            "uniform mat4 uSkyMatrix;\n" +
            "attribute vec3 vPosition;\n" +
            "attribute vec2 vTexCoord;\n" +
            "attribute vec2 vTangent;\n" +
            "attribute vec2 vBitangent;\n" +
            "attribute vec2 vNormal;\n" +
            "#ifdef VERTEX_COLOR\n" +
            "attribute vec4 vColor;\n" +
            "#endif\n" +
            "#ifdef TEXCOORD_SECONDARY\n" +
            "attribute vec2 vTexCoord2;\n" +
            "#endif\n" +
            "varying highp vec3 D;\n" +
            "varying  vec2 j;\n" +
            "varying  vec3 E;\n" +
            "varying  vec3 F;\n" +
            "varying  vec3 G;\n" +
            "#ifdef VERTEX_COLOR\n" +
            "varying lowp vec4 H;\n" +
            "#endif\n" +
            "#ifdef TEXCOORD_SECONDARY\n" +
            "varying mediump vec2 I;\n" +
            "#endif\n" +
            "vec3 ic(vec2 id){bool ie=(id.y>(32767.1/65535.0));\n" +
            "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
            "vec3 r;\n" +
            "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
            "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
            "r.z=ie?-r.z:r.z;\n" +
            "return r;\n" +
            "}vec4 m(mat4 o,vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));\n" +
            "}vec3 ih(mat4 o,vec3 id){return o[0].xyz*id.x+o[1].xyz*id.y+o[2].xyz*id.z;\n" +
            "}void main(void){gl_Position=m(uModelViewProjectionMatrix,vPosition.xyz);\n" +
            "j=vTexCoord;\n" +
            "E=ic(vTangent);\n" +
            "F=ic(vBitangent);\n" +
            "G=ic(vNormal);\n" +
            "D=m(uSkyMatrix,vPosition.xyz).xyz;\n" +
            "#ifdef VERTEX_COLOR\n" +
            "H=vColor;\n" +
            "#endif\n" +
            "#ifdef TEXCOORD_SECONDARY\n" +
            "I=vTexCoord2;\n" +
            "#endif\n" +
            "}\n" 

        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =
            "#define MOBILE\n" +
            "#define NOBLEND\n" +
            "#define SHADOW_COUNT 3\n" +
            "#define LIGHT_COUNT 3\n" +
            "#extension GL_OES_standard_derivatives : enable\n" +
            "precision mediump float;\n" +
            "varying highp vec3 D;\n" +
            "varying  vec2 j;\n" +
            "varying  vec3 E;\n" +
            "varying  vec3 F;\n" +
            "varying  vec3 G;\n" +
            "#ifdef VERTEX_COLOR\n" +
            "varying lowp vec4 H;\n" +
            "#endif\n" +
            "#ifdef TEXCOORD_SECONDARY\n" +
            "varying mediump vec2 I;\n" +
            "#endif\n" +
            "uniform sampler2D tAlbedo;\n" +
            "uniform sampler2D tReflectivity;\n" +
            "uniform sampler2D tNormal;\n" +
            "uniform sampler2D tExtras;\n" +
            "uniform sampler2D tSkySpecular;\n" +
            "uniform vec4 uDiffuseCoefficients[9];\n" +
            "uniform vec3 uCameraPosition;\n" +
            "uniform vec3 uFresnel;\n" +
            "uniform float uAlphaTest;\n" +
            "uniform float uHorizonOcclude;\n" +
            "uniform float uHorizonSmoothing;\n" +
            "#ifdef EMISSIVE\n" +
            "uniform float uEmissiveScale;\n" +
            "uniform vec4 uTexRangeEmissive;\n" +
            "#endif\n" +
            "#ifdef AMBIENT_OCCLUSION\n" +
            "uniform vec4 uTexRangeAO;\n" +
            "#endif\n" +
            "#ifdef LIGHT_COUNT\n" +
            "uniform vec4 uLightPositions[LIGHT_COUNT];\n" +
            "uniform vec3 uLightDirections[LIGHT_COUNT];\n" +
            "uniform vec3 uLightColors[LIGHT_COUNT];\n" +
            "uniform vec3 uLightParams[LIGHT_COUNT];\n" +
            "uniform vec3 uLightSpot[LIGHT_COUNT];\n" +
            "#endif\n" +
            "#ifdef ANISO\n" +
            "uniform float uAnisoStrength;\n" +
            "uniform vec3 uAnisoTangent;\n" +
            "uniform float uAnisoIntegral;\n" +
            "uniform vec4 uTexRangeAniso;\n" +
            "#endif\n" +
            "#define saturate(x) clamp( x, 0.0, 1.0 )\n" +
            "vec3 L(vec3 c){return c*c;\n" +
            "}vec3 O(vec3 n){vec3 fA=E;\n" +

            "vec3 fB=F;\n" +
            "vec3 fC=G;\n" +
            "n=2.0*n-vec3(1.0);\n" +
            "return normalize(fA*n.x+fB*n.y+fC*n.z);\n" +
            "}vec3 Q(vec3 t){vec3 fC=gl_FrontFacing?G:-G;\n" +
            "return normalize(E*t.x+F*t.y+fC*t.z);\n" +
            "}vec4 R(vec2 fE,vec4 fF){\n" +

            "return texture2D(tExtras,fract(fE)*fF.xy+fF.zw);\n" +

            "}vec3 fJ(sampler2D fK,vec2 fL,float fM){vec3 n=texture2D(fK,fL,fM*2.5).xyz;\n" +
            "return O(n);\n" +
            "}\n" +
            "vec3 ed(vec3 ee,float ef){return exp(-0.5*ef/(ee*ee))/(ee*2.5066283);\n" +
            "}vec3 eh(vec3 ee){return vec3(1.0,1.0,1.0)/(ee*2.5066283);\n" +
            "}vec3 ei(vec3 ej){return vec3(-0.5,-0.5,-0.5)/(ej);\n" +
            "}vec3 ek(vec3 el,float ef){return exp(el*ef);\n" +
            "}\n" +
            "#define SAMPLE_COUNT 21.0\n" +
            "#define SAMPLE_HALF 10.0\n" +
            "#define GAUSS_SPREAD 0.05\n" +
            "vec3 em(float en,float eo,vec3 eu){vec3 ev=vec3(eo,eo,eo);\n" +
            "ev=0.8*ev+vec3(0.2);\n" +
            "vec3 eA=cos(ev*3.14159);\n" +
            "vec3 eB=cos(ev*3.14159*0.5);\n" +
            "eB*=eB;\n" +
            "eB*=eB;\n" +
            "eB*=eB;\n" +
            "ev=ev+0.05*eA*eB*eu;\n" +
            "eB*=eB;\n" +
            "eB*=eB;\n" +
            "eB*=eB;\n" +
            "ev=ev+0.1*eA*eB*eu;\n" +
            "ev=saturate(ev);\n" +
            "ev*=ev*1.2;\n" +
            "return ev;\n" +
            "}vec3 eC(vec3 eu){return vec3(1.0,1.0,1.0)/3.1415926;\n" +
            "}float eD(float en,float eu){return saturate(-en*eu+en+eu);\n" +
            "}vec3 eE(float en,vec3 eu){return saturate(-en*eu+vec3(en)+eu);\n" +
            "}float eF(float eu){return-0.31830988618379*eu+0.31830988618379;\n" +
            "}vec3 eG(vec3 eu){return-0.31830988618379*eu+vec3(0.31830988618379);\n" +
            "}vec3 dY(vec3 T,vec3 N,vec3 U,float eH){float eI=1.0-saturate(dot(T,N));\n" +
            "float eJ=eI*eI;\n" +
            "eI*=eJ*eJ;\n" +
            "eI*=eH;\n" +
            "return(U-eI*U)+eI*uFresnel;\n" +
            "}vec2 eK(vec2 eL,vec2 eu){eL=1.0-eL;\n" +
            "vec2 eM=eL*eL;\n" +
            "eM*=eM;\n" +
            "eL=mix(eM,eL*0.4,eu);\n" +
            "return eL;\n" +
            "}vec3 du(vec3 eN){\n" +
            "#define c(n) uDiffuseCoefficients[n].xyz\n" +
            "vec3 C=(c(0)+eN.y*((c(1)+c(4)*eN.x)+c(5)*eN.z))+eN.x*(c(3)+c(7)*eN.z)+c(2)*eN.z;\n" +
            "#undef c\n" +
            "vec3 sqr=eN*eN;\n" +
            "C+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);\n" +
            "C+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);\n" +
            "return C;\n" +
            "}void eO(inout vec3 eP,inout vec3 eQ,inout vec3 eR,vec3 eN){eP=uDiffuseCoefficients[0].xyz;\n" +
            "eQ=uDiffuseCoefficients[1].xyz*eN.y;\n" +
            "eQ+=uDiffuseCoefficients[2].xyz*eN.z;\n" +
            "eQ+=uDiffuseCoefficients[3].xyz*eN.x;\n" +
            "vec3 swz=eN.yyz*eN.xzx;\n" +
            "eR=uDiffuseCoefficients[4].xyz*swz.x;\n" +
            "eR+=uDiffuseCoefficients[5].xyz*swz.y;\n" +
            "eR+=uDiffuseCoefficients[7].xyz*swz.z;\n" +
            "vec3 sqr=eN*eN;\n" +
            "eR+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);\n" +
            "eR+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);\n" +
            "}vec3 eS(vec3 eP,vec3 eQ,vec3 eR,vec3 eT,float eu){eT=mix(vec3(1.0),eT,eu);\n" +
            "return(eP+eQ*eT.x)+eR*eT.z;\n" +
            "}vec3 eU(vec3 eP,vec3 eQ,vec3 eR,vec3 eT,vec3 eV){vec3 eW=mix(vec3(1.0),eT.yyy,eV);\n" +
            "vec3 eX=mix(vec3(1.0),eT.zzz,eV);\n" +
            "return(eP+eQ*eW)+eR*eX;\n" +
            "}vec3 dB(vec3 eN,float V){eN/=dot(vec3(1.0),abs(eN));\n" +
            "vec2 eY=abs(eN.zx)-vec2(1.0,1.0);\n" +
            "vec2 eZ=vec2(eN.x<0.0?eY.x:-eY.x,eN.z<0.0?eY.y:-eY.y);\n" +
            "vec2 fc=(eN.y<0.0)?eZ:eN.xz;\n" +
            "fc=vec2(0.5*(254.0/256.0),0.125*0.5*(254.0/256.0))*fc+vec2(0.5,0.125*0.5);\n" +
            "float fd=fract(7.0*V);\n" +
            "fc.y+=0.125*(7.0*V-fd);\n" +
            "vec2 fe=fc+vec2(0.0,0.125);\n" +
            "vec4 ff=mix(texture2D(tSkySpecular,fc),texture2D(tSkySpecular,fe),fd);\n" +
            "vec3 r=ff.xyz*(7.0*ff.w);\n" +
            "return r*r;\n" +
            "}float dC(vec3 eN,vec3 fh){float fi=dot(eN,fh);\n" +
            "fi=saturate(1.0+uHorizonOcclude*fi);\n" +
            "return fi*fi;\n" +
            "}\n" +
            "#ifdef SHADOW_COUNT\n" +
            "#ifdef MOBILE\n" +
            "#define SHADOW_KERNEL (4.0/1536.0)\n" +
            "#else\n" +
            "#define SHADOW_KERNEL (4.0/2048.0)\n" +
            "#endif\n" +
            "highp vec4 m(highp mat4 o,highp vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));\n" +
            "}uniform sampler2D tDepth0;\n" +
            "#if SHADOW_COUNT > 1\n" +
            "uniform sampler2D tDepth1;\n" +
            "#if SHADOW_COUNT > 2\n" +
            "uniform sampler2D tDepth2;\n" +
            "#endif\n" +
            "#endif\n" +
            "uniform highp vec2 uShadowKernelRotation;\n" +
            "uniform highp vec4 uShadowMapSize;\n" +
            "uniform highp mat4 uShadowMatrices[SHADOW_COUNT];\n" +
            "uniform highp mat4 uInvShadowMatrices[SHADOW_COUNT];\n" +
            "uniform highp vec4 uShadowTexelPadProjections[SHADOW_COUNT];\n" +
            "highp float fN(highp vec3 C){return(C.x+C.y*(1.0/255.0))+C.z*(1.0/65025.0);\n" +
            "}float fO(sampler2D fP,highp vec2 fE,highp float fQ){\n" +
            "#ifndef MOBILE\n" +
            "highp vec2 c=fE*uShadowMapSize.xy;\n" +
            "highp vec2 a=floor(c)*uShadowMapSize.zw,b=ceil(c)*uShadowMapSize.zw;\n" +
            "highp vec4 dK;\n" +
            "dK.x=fN(texture2D(fP,a).xyz);\n" +
            "dK.y=fN(texture2D(fP,vec2(b.x,a.y)).xyz);\n" +
            "dK.z=fN(texture2D(fP,vec2(a.x,b.y)).xyz);\n" +
            "dK.w=fN(texture2D(fP,b).xyz);\n" +
            "highp vec4 fR;\n" +
            "fR.x=fQ<dK.x?1.0:0.0;\n" +
            "fR.y=fQ<dK.y?1.0:0.0;\n" +
            "fR.z=fQ<dK.z?1.0:0.0;\n" +
            "fR.w=fQ<dK.w?1.0:0.0;\n" +
            "highp vec2 w=c-a*uShadowMapSize.xy;\n" +
            "vec2 s=(w.y*fR.zw+fR.xy)-w.y*fR.xy;\n" +
            "return(w.x*s.y+s.x)-w.x*s.x;\n" +
            "#else\n" +
            "highp float C=fN(texture2D(fP,fE.xy).xyz);\n" +
            "return fQ<C?1.0:0.0;\n" +
            "#endif\n" +
            "}highp float fS(sampler2D fP,highp vec3 fE,float fT){highp vec2 v=uShadowKernelRotation*fT;\n" +
            "float s;\n" +
            "s=fO(fP,fE.xy+v,fE.z);\n" +
            "s+=fO(fP,fE.xy-v,fE.z);\n" +
            "s+=fO(fP,fE.xy+vec2(-v.y,v.x),fE.z);\n" +
            "s+=fO(fP,fE.xy+vec2(v.y,-v.x),fE.z);\n" +
            "s*=0.25;\n" +
            "return s*s;\n" +
            "}struct dF{float dR[LIGHT_COUNT];\n" +
            "};\n" +
            "void dH(out dF ss,float fT){highp vec3 fU[SHADOW_COUNT];\n" +
            "vec3 fC=gl_FrontFacing?G:-G;\n" +
            "for(int u=0;\n" +
            "u<SHADOW_COUNT;\n" +
            "++u){vec4 fV=uShadowTexelPadProjections[u];\n" +
            "float fW=fV.x*D.x+(fV.y*D.y+(fV.z*D.z+fV.w));\n" +
            "#ifdef MOBILE\n" +
            "fW*=.001+fT;\n" +
            "#else\n" +
            "fW*=.0005+0.5*fT;\n" +
            "#endif\n" +
            "highp vec4 fX=m(uShadowMatrices[u],D+fW*fC);\n" +
            "fU[u]=fX.xyz/fX.w;\n" +
            "}float J;\n" +
            "#if SHADOW_COUNT > 0\n" +
            "J=fS(tDepth0,fU[0],fT);\n" +
            "ss.dR[0]=J;\n" +
            "#endif\n" +
            "#if SHADOW_COUNT > 1\n" +
            "J=fS(tDepth1,fU[1],fT);\n" +
            "ss.dR[1]=J;\n" +
            "#endif\n" +
            "#if SHADOW_COUNT > 2\n" +
            "J=fS(tDepth2,fU[2],fT);\n" +
            "ss.dR[2]=J;\n" +
            "#endif\n" +
            "for(int u=SHADOW_COUNT;\n" +
            "u<LIGHT_COUNT;\n" +
            "++u){ss.dR[u]=1.0;\n" +
            "}}struct dJ{highp float dK[LIGHT_COUNT];\n" +
            "};\n" +
            "highp vec4 fY(sampler2D fP,highp vec2 fE,highp mat4 fZ){highp vec4 hc;\n" +
            "hc.xy=fE;\n" +
            "#ifndef MOBILE\n" +
            "highp vec2 c=fE*uShadowMapSize.xy;\n" +
            "highp vec2 a=floor(c)*uShadowMapSize.zw,b=ceil(c)*uShadowMapSize.zw;\n" +
            "highp vec4 fR;\n" +
            "fR.x=fN(texture2D(fP,a).xyz);\n" +
            "fR.y=fN(texture2D(fP,vec2(b.x,a.y)).xyz);\n" +
            "fR.z=fN(texture2D(fP,vec2(a.x,b.y)).xyz);\n" +
            "fR.w=fN(texture2D(fP,b).xyz);\n" +
            "highp vec2 w=c-a*uShadowMapSize.xy;\n" +
            "vec2 s=(w.y*fR.zw+fR.xy)-w.y*fR.xy;\n" +
            "hc.z=(w.x*s.y+s.x)-w.x*s.x;\n" +
            "#else \n" +
            "hc.z=fN(texture2D(fP,fE.xy).xyz);\n" +
            "#endif\n" +
            "hc=m(fZ,hc.xyz);\n" +
            "hc.xyz/=hc.w;\n" +
            "return hc;\n" +
            "}void dM(out dJ ss,float fT){highp vec3 hd[SHADOW_COUNT];\n" +
            "vec3 fC=gl_FrontFacing?G:-G;\n" +
            "fC*=0.6;\n" +
            "for(int u=0;\n" +
            "u<SHADOW_COUNT;\n" +
            "++u){vec4 fV=uShadowTexelPadProjections[u];\n" +
            "float fW=fV.x*D.x+(fV.y*D.y+(fV.z*D.z+fV.w));\n" +
            "#ifdef MOBILE\n" +
            "fW*=.001+fT;\n" +
            "#else\n" +
            "fW*=.0005+0.5*fT;\n" +
            "#endif\n" +
            "highp vec4 fX=m(uShadowMatrices[u],D-fW*fC);\n" +
            "hd[u]=fX.xyz/fX.w;\n" +
            "}highp vec4 he;\n" +
            "#if SHADOW_COUNT > 0\n" +
            "he=fY(tDepth0,hd[0].xy,uInvShadowMatrices[0]);\n" +
            "ss.dK[0]=length(D.xyz-he.xyz);\n" +
            "#endif\n" +
            "#if SHADOW_COUNT > 1\n" +
            "he=fY(tDepth1,hd[1].xy,uInvShadowMatrices[1]);\n" +
            "ss.dK[1]=length(D.xyz-he.xyz);\n" +
            "#endif\n" +
            "#if SHADOW_COUNT > 2\n" +
            "he=fY(tDepth2,hd[2].xy,uInvShadowMatrices[2]);\n" +
            "ss.dK[2]=length(D.xyz-he.xyz);\n" +
            "#endif\n" +
            "for(int u=SHADOW_COUNT;\n" +
            "u<LIGHT_COUNT;\n" +
            "++u){ss.dK[u]=1.0;\n" +
            "}}\n" +
            "#endif\n" +
            "#ifdef SKIN\n" +
            "uniform vec4 uTexRangeSubdermis;\n" +
            "uniform vec4 uTexRangeTranslucency;\n" +
            "uniform vec4 uTexRangeFuzz;\n" +
            "uniform vec3 uSubdermisColor;\n" +
            "uniform vec4 uTransColor;\n" +
            "uniform float uTransScatter;\n" +
            "uniform vec4 uFresnelColor;\n" +
            "uniform float uFresnelOcc;\n" +
            "uniform float uFresnelGlossMask;\n" +
            "uniform float uTransSky;\n" +
            "uniform float uFresnelIntegral;\n" +
            "uniform float uTransIntegral;\n" +
            "uniform float uSkinTransDepth;\n" +
            "uniform float uSkinShadowBlur;\n" +
            "uniform float uNormalSmooth;\n" +
            "struct de{vec3 hf;\n" +
            "vec3 hh,hi,hj,fj;\n" +
            "vec3 di,dm,hk;\n" +
            "vec3 hl;\n" +
            "vec3 hm;\n" +
            "vec3 hn;\n" +
            "vec3 ho;\n" +
            "float hu;\n" +
            "float hv;\n" +
            "float hA;\n" +
            "float dI;\n" +
            "};\n" +
            "void dh(out de s){vec4 J;\n" +
            "#ifdef SKIN_NO_SUBDERMIS_TEX\n" +
            "s.hf=uSubdermisColor;\n" +
            "s.hA=1.0;\n" +
            "#else \n" +
            "J=R(j,uTexRangeSubdermis);\n" +
            "s.hf=L(J.xyz);\n" +
            "s.hA=J.w*J.w;\n" +
            "#endif\n" +
            "s.ho=uTransColor.rgb;\n" +
            "s.hu=uTransScatter;\n" +
            "#ifdef SKIN_VERSION_1\n" +
            "s.dI=uSkinShadowBlur*s.hA;\n" +
            "#else \n" +
            "s.hv=max(max(s.ho.r,s.ho.g),s.ho.b)*uTransColor.a;\n" +
            "float hB=max(s.hf.r,max(s.hf.g,s.hf.b));\n" +
            "hB=1.0-hB;\n" +
            "hB*=hB;\n" +
            "hB*=hB;\n" +
            "hB*=hB;\n" +
            "hB=1.0-(hB*hB);\n" +
            "s.hA*=hB;\n" +
            "s.dI=uSkinShadowBlur*s.hA*dot(s.hf.rgb,vec3(0.333,0.334,0.333));\n" +
            "#endif\n" +
            "#ifndef SKIN_NO_TRANSLUCENCY_TEX\n" +
            "J=R(j,uTexRangeTranslucency);\n" +
            "s.ho*=L(J.xyz);\n" +
            "#endif\n" +
            "s.hl=fJ(tNormal,j,uNormalSmooth*s.hA);\n" +
            "vec3 hC,hD,hE;\n" +
            "eO(hC,hD,hE,s.hl);\n" +
            "s.dm=s.hh=hC+hD+hE;\n" +
            "#ifdef SKIN_VERSION_1 \n" +
            "s.di=eU(hC,hD,hE,vec3(1.0,0.6667,0.25),s.hf);\n" +
            "#else\n" +
            "s.di=eU(hC,hD,hE,vec3(1.0,0.6667,0.25),s.hf*0.2+vec3(0.1));\n" +
            "#endif\n" +
            "#ifdef SKIN_VERSION_1\n" +
            "vec3 hF,hG,hH;\n" +
            "eO(hF,hG,hH,-s.hl);\n" +
            "s.hk=eS(hF,hG,hH,vec3(1.0,0.4444,0.0625),s.hu);\n" +
            "s.hk*=uTransSky;\n" +
            "#else \n" +
            "s.hk=vec3(0.0);\n" +
            "#endif\n" +
            "s.hi=s.hj=s.fj=vec3(0.0);\n" +
            "s.hf*=0.5;\n" +
            "s.hu*=0.5;\n" +
            "s.hm=uFresnelColor.rgb;\n" +
            "s.hn=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n" +
            "#ifndef SKIN_NO_FUZZ_TEX\n" +
            "J=R(j,uTexRangeFuzz);\n" +
            "s.hm*=L(J.rgb);\n" +
            "#endif\n" +
            "}void dQ(inout de s,float hI,float hJ,vec3 dN,vec3 N,vec3 dP){float en=dot(dN,N);\n" +
            "float eo=dot(dN,s.hl);\n" +
            "float dT=saturate((1.0/3.1415926)*en);\n" +
            "float fm=hI*hI;\n" +
            "fm*=fm;\n" +
            "fm=saturate(6.0*fm);\n" +
            "#ifdef SKIN_VERSION_1 \n" +
            "vec3 hK=eE(eo,s.hf);\n" +
            "#else \n" +
            "vec3 hK=em(en,eo,s.hf);\n" +
            "#endif\n" +
            "float hL=eD(-eo,s.hu);\n" +
            "vec3 hj=vec3(hL*hL);\n" +
            "#ifdef SKIN_VERSION_1\n" +
            "#ifdef SHADOW_COUNT\n" +
            "vec3 hM=vec3(hI);\n" +
            "float hN=saturate(fm-2.0*(hI*hI));\n" +
            "hM+=hN*s.hf;\n" +
            "float hO=hI;\n" +
            "#endif\n" +
            "#else\n" +
            "#ifdef SHADOW_COUNT\n" +
            "vec3 hM;\n" +
            "highp vec3 hP=(0.995*s.hf)+vec3(0.005,0.005,0.005);\n" +
            "highp vec3 hQ=vec3(1.0)-hP;\n" +
            "hP=mix(hP,hQ,hI);\n" +
            "float hR=sqrt(hI);\n" +
            "vec3 hS=2.0*vec3(1.0-hR);\n" +
            "hR=1.0-hR;\n" +
            "hR=(1.0-hR*hR);\n" +
            "hM=saturate(pow(hP*hR,hS));\n" +
            "highp float hT=0.35/(uSkinTransDepth+0.001);\n" +
            "highp float hU=saturate(hJ*hT);\n" +
            "hU=saturate(1.0-hU);\n" +
            "hU*=hU;\n" +
            "highp vec3 hV=vec3((-3.0*hU)+3.15);\n" +
            "highp vec3 hW=(0.9975*s.ho)+vec3(0.0025,0.0025,0.0025);\n" +
            "highp float hB=saturate(10.0*dot(hW,hW));\n" +
            "vec3 hO=pow(hW*hU,hV)*hB;\n" +
            "#else \n" +
            "hj=vec3(0.0);\n" +
            "#endif\n" +
            "#endif\n" +
            "float fn=eD(eo,s.hn.z);\n" +
            "#ifdef SHADOW_COUNT\n" +
            "vec3 fo=mix(vec3(1.0),hM,uFresnelOcc);\n" +
            "vec3 fj=fn*fo;\n" +
            "#else\n" +
            "vec3 fj=vec3(fn);\n" +
            "#endif\n" +
            "#ifdef SHADOW_COUNT\n" +
            "hK*=hM;\n" +
            "dT*=fm;\n" +
            "hj*=hO;\n" +
            "#endif\n" +
            "s.fj=fj*dP+s.fj;\n" +
            "s.hj=hj*dP+s.hj;\n" +
            "s.hi=hK*dP+s.hi;\n" +
            "s.hh=dT*dP+s.hh;\n" +
            "}void dW(out vec3 dn,out vec3 diff_extra,inout de s,vec3 T,vec3 N,float V){s.fj*=uFresnelIntegral;\n" +
            "float eL=dot(T,N);\n" +
            "vec2 fu=eK(vec2(eL,eL),s.hn.xy);\n" +
            "s.fj=s.dm*fu.x+(s.fj*fu.y);\n" +
            "s.fj*=s.hm;\n" +
            "float fv=saturate(1.0+-uFresnelGlossMask*V);\n" +
            "s.fj*=fv*fv;\n" +
            "s.hj=s.hj*uTransIntegral;\n" +
            "#ifdef SKIN_VERSION_1\n" +
            "s.hi=(s.hi*eG(s.hf))+s.di;\n" +
            "#else\n" +
            "s.hi=(s.hi*eC(s.hf))+s.di;\n" +
            "#endif\n" +
            "dn=mix(s.hh,s.hi,s.hA);\n" +
            "#ifdef SKIN_VERSION_1\n" +
            "s.hj=(s.hj+s.hk)*s.ho;\n" +
            "diff_extra=(s.fj+s.hj)*s.hA;\n" +
            "#else\n" +
            "dn+=s.hj*s.hv;\n" +
            "diff_extra=s.fj*s.hA;\n" +
            "#endif\n" +
            "}\n" +
            "#endif\n" +
            "#ifdef MICROFIBER\n" +
            "uniform vec4 uTexRangeFuzz;\n" +
            "uniform float uFresnelIntegral;\n" +
            "uniform vec4 uFresnelColor;\n" +
            "uniform float uFresnelOcc;\n" +
            "uniform float uFresnelGlossMask;\n" +
            "struct dj{vec3 dm;\n" +
            "vec3 dT;\n" +
            "vec3 fj;\n" +
            "vec3 fk;\n" +
            "vec3 fl;\n" +
            "};\n" +
            "void dl(out dj s,vec3 N){s.dm=s.dT=du(N);\n" +
            "s.fj=vec3(0.0);\n" +
            "s.fk=uFresnelColor.rgb;\n" +
            "s.fl=uFresnelColor.aaa*vec3(1.0,0.5,0.25);\n" +
            "#ifndef MICROFIBER_NO_FUZZ_TEX\n" +
            "vec4 J=R(j,uTexRangeFuzz);\n" +
            "s.fk*=L(J.rgb);\n" +
            "#endif\n" +
            "}void dS(inout dj s,float fm,vec3 dN,vec3 N,vec3 dP){float en=dot(dN,N);\n" +
            "float dT=saturate((1.0/3.1415926)*en);\n" +
            "float fn=eD(en,s.fl.z);\n" +
            "#ifdef SHADOW_COUNT\n" +
            "dT*=fm;\n" +
            "float fo=mix(1.0,fm,uFresnelOcc);\n" +
            "float fj=fn*fo;\n" +
            "#else \n" +
            "float fj=fn;\n" +
            "#endif\n" +
            "s.fj=fj*dP+s.fj;\n" +
            "s.dT=dT*dP+s.dT;\n" +
            "}void dX(out vec3 dn,out vec3 diff_extra,inout dj s,vec3 T,vec3 N,float V){s.fj*=uFresnelIntegral;\n" +
            "float eL=dot(T,N);\n" +
            "vec2 fu=eK(vec2(eL,eL),s.fl.xy);\n" +
            "s.fj=s.dm*fu.x+(s.fj*fu.y);\n" +
            "s.fj*=s.fk;\n" +
            "float fv=saturate(1.0+-uFresnelGlossMask*V);\n" +
            "s.fj*=fv*fv;\n" +
            "dn=s.dT;\n" +
            "diff_extra=s.fj;\n" +
            "}\n" +
            "#endif\n" +
            "#ifdef STRIPVIEW\n" +
            "uniform float uStrips[5];\n" +
            "uniform vec2 uStripRes;\n" +
            "struct Y{float hB[5];\n" +
            "float bg;\n" +
            "};\n" +
            "void dc(out Y hX,inout float V,inout vec3 U){highp vec2 fE=gl_FragCoord.xy*uStripRes-vec2(1.0,1.0);\n" +
            "fE.x+=0.25*fE.y;\n" +
            "hX.hB[0]=step(fE.x,uStrips[0]);\n" +
            "hX.hB[1]=step(fE.x,uStrips[1]);\n" +
            "hX.hB[2]=step(fE.x,uStrips[2]);\n" +
            "hX.hB[3]=step(fE.x,uStrips[3]);\n" +
            "hX.hB[4]=step(fE.x,uStrips[4]);\n" +
            "hX.bg=1.0-hX.hB[4];\n" +
            "hX.hB[4]-=hX.hB[3];\n" +
            "hX.hB[3]-=hX.hB[2];\n" +
            "hX.hB[2]-=hX.hB[1];\n" +
            "hX.hB[1]-=hX.hB[0];\n" +
            "bool hY=hX.hB[4]>0.0;\n" +
            "V=hY?0.5:V;\n" +
            "U=hY?vec3(0.1):U;\n" +
            "}vec3 ec(Y hX,vec3 N,vec3 K,vec3 U,float V,vec3 dn,vec3 dA,vec3 hZ){return hX.hB[0]*(N*0.5+vec3(0.5))+hX.hB[1]*K+hX.hB[2]*U+vec3(hX.hB[3]*V)+hX.hB[4]*(vec3(0.12)+0.3*dn+dA)+hX.bg*hZ;\n" +
            "}\n" +
            "#endif\n" +
            "#ifdef TRANSPARENCY_DITHER\n" +
            "float l(highp float B){highp float C=0.5*fract(gl_FragCoord.x*0.5)+0.5*fract(gl_FragCoord.y*0.5);\n" +
            "return 0.4+0.6*fract(C+3.141592e6*B);\n" +
            "}\n" +
            "#endif\n" +
            "void main(void){\n" +
            "vec4 J=texture2D(tAlbedo,j);\n" +

            "vec3 outv3c3=vec3(0.99,1.0,1.0);\n" +
            "vec3 K=L(J.xyz);\n" +
            "vec3 N=O(texture2D(tNormal,j).xyz);\n" +
            "outv3c3=N.xyz;\n" +
            "vec3 T=normalize(uCameraPosition-D);\n" +
            "J=texture2D(tReflectivity,j);\n" +
            "vec3 U=L(J.xyz);\n" +
            "float V=J.w;\n" +
            "float W=V;\n" +
            "float dd=1.0;\n" +
            "vec3 dn=du(N);\n" +
            "dn*=dd;\n" +
            "vec3 dv=reflect(-T,N);\n" +
            "vec3 dA=dB(dv,V);\n" +

            "dA*=dC(dv,G);\n" +
           
            "#ifdef LIGHT_COUNT\n"+
                "highp float dD=10.0/log2(V*0.968+0.03);\n"+
                "dD*=dD;\n"+
                "float dE=dD*(1.0/(8.0*3.1415926))+(4.0/(8.0*3.1415926));\n"+
                "dE=min(dE,1.0e3);\n"+
                "dF dG;\n"+
                "dH(dG,SHADOW_KERNEL);\n"+
                "for(int u=0;u<LIGHT_COUNT;++u){\n"+
                    "vec3 dN=uLightPositions[u].xyz-D*uLightPositions[u].w;\n"+
                    "float dO=inversesqrt(dot(dN,dN));\n"+
                    "dN*=dO;\n"+
                    "float a=saturate(uLightParams[u].z/dO);\n"+
                    "a=1.0+a*(uLightParams[u].x+uLightParams[u].y*a);\n"+
                    "float s=saturate(dot(dN,uLightDirections[u]));\n"+
                    "s=saturate(uLightSpot[u].y-uLightSpot[u].z*(1.0-s*s));\n"+
                    "vec3 dP=(a*s)*uLightColors[u].xyz;\n"+
                    "float dT=saturate((1.0/3.1415926)*dot(dN,N));\n"+
                    "dn+=dT*dP;\n"+
                    "vec3 dU=dN+T;\n"+
                    "dU=normalize(dU);\n"+
                    "float dV=dE*pow(saturate(dot(dU,N)),dD);\n"+
                    "dA+=dV*dP;\n"+
                "}\n"+
            "#endif\n"+
           
            "dA*=dY(T,N,U,V*V);\n" +
            "gl_FragColor.xyz=dn*K+dA;\n" +
            "if(outv3c3.x!=0.99){\n" +
            "gl_FragColor.xyz=outv3c3.xyz;\n" +
            "}\n" +
            "gl_FragColor.w=1.0;\n" +
          //  "gl_FragColor.xyz= vec3(J.xyz);\n" +
            "}\n"

        return $str



    }

}

class ProdkarenModelSprite extends BaseDiplay3dSprite {

    constructor() {
        super();
        this.scaleX = 1
        this.scaleY = 1
        this.scaleZ = 1

        ProgrmaManager.getInstance().registe(ProdkarenModelShader.ProdkarenModelShader, new ProdkarenModelShader);
        this.shader = ProgrmaManager.getInstance().getProgram(ProdkarenModelShader.ProdkarenModelShader);
        this.program = this.shader.program;

        ProdkarenResModel.getInstance().loadBuffByTxtUrl("model.txt", ($buff: WebGLBuffer) => {
            this.modelBuff = $buff;
        });
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/ccav.txt", (groupRes: GroupRes) => {
            this.loadPartRes(groupRes)
        })

    }

    private kkkDisplay3DSprite: Display3DSprite
    public loadPartRes(groupRes: GroupRes): void {
        for (var i: number = 0; i < groupRes.dataAry.length; i++) {
            var item: GroupItem = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                this.kkkDisplay3DSprite = new Display3DSprite
                this.kkkDisplay3DSprite.setObjUrl(item.objUrl);
                return
            }
        }


    }

    private modelBuff: WebGLBuffer
    private normalTextRes: TextureRes
    private reflectivityRes: TextureRes
    private tSkySpecular: TextureRes
    private reflectivityalphaRes: TextureRes
    protected loadTexture(): void {

        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic703432.txt", ($texture: TextureRes) => {
            this._uvTextureRes = $texture
        });
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic598211.txt", ($texture: TextureRes) => {
            this.reflectivityRes = $texture
        });
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("reflectivityalpha.txt", ($texture: TextureRes) => {
            this.reflectivityalphaRes = $texture
        });
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic535317.txt", ($texture: TextureRes) => {
            this.normalTextRes = $texture
        });
        ProdkarenResModel.getInstance().loadSkyTextureByUrl("picsky.txt", ($texture: TextureRes) => {
            this.tSkySpecular = $texture
        });

        ProdkarenResModel.getInstance().flectAlphaByUrl("pic598211.txt", "reflectivityalpha.txt", ($texture: TextureRes) => {


            this.imageDataReflecRes = $texture;
        });
        

    }
    private imageDataReflecRes: TextureRes;
    /*
    private parseFile(): void {
        if (this.reflectivityRes && this.reflectivityalphaRes) {
            console.log("ccav")
            var $textureRes: TextureRes = ProdkarenResModel.getInstance().fromFilesMergeAlpha(this.reflectivityRes, this.reflectivityalphaRes)
            this.reflectivityRes = $textureRes;
        }
    }
    */
 

    private skipNum: number = 0
    private mathCamPos($mouseM: Matrix3D): Vector3D {
        var $m: Matrix3D = $mouseM.clone()
        $m.invert()
        var $kpos: Vector3D = new Vector3D(11.002893447875977, - 1.5622071027755737, 14.670757293701172);
        $kpos = $m.transformVector($kpos);
        return $kpos
    }

    public update(): void {
        if (this.kkkDisplay3DSprite && this.kkkDisplay3DSprite.objData) {
            if (this.tSkySpecular && this._uvTextureRes && this.reflectivityRes && this.normalTextRes && this.imageDataReflecRes && this.modelBuff) {
                Scene_data.context3D.setProgram(this.program);
                /*
                var $uModelViewProjectionMatrix: Matrix3D = Scene_data.viewMatrx3D.clone();
                $uModelViewProjectionMatrix.prepend(Scene_data.cam3D.cameraMatrix);
                $uModelViewProjectionMatrix.prepend(this.posMatrix);
                */

                var $view: Matrix3D = new Matrix3D
                $view.m = new Float32Array([0.8084872961044312, 0.07859973609447479, 0.5832412242889404, 0, 5.799292157604441e-9, 0.9910411834716797, -0.13355635106563568, 0, -0.5885136127471924, 0.10797861963510513, 0.8012441992759705, -0, -0.2617589235305786, -0.9007410407066345, -18.380844116210938, 1])

                var $mouseM: Matrix3D = new Matrix3D
                $mouseM.appendRotation(-(Scene_data.focus3D.rotationX + 45) / 10, Vector3D.X_AXIS);
                $mouseM.appendRotation(-Scene_data.focus3D.rotationY / 5, Vector3D.Y_AXIS);
         
                $view.prepend($mouseM);
                var $pos: Matrix3D = new Matrix3D
                $pos.m = new Float32Array([1.6897958517074585, 0, 0, 0, 0, 2.999999761581421, 0, 0, -0.0006377550889737904, 0.00045289855916053057, -1, -1, 0, 0, -0.6000000238418579, 0])
                var empteyM: Matrix3D = new Matrix3D()
                Matrix3D.mul(empteyM.m, $pos.m, $view.m )
                var $uModelViewProjectionMatrix: Matrix3D = empteyM.clone();
                var $disScale: number = Scene_data.cam3D.distance / 250
                $uModelViewProjectionMatrix.appendScale($disScale, $disScale, 1)
                Scene_data.context3D.setVcMatrix4fv(this.shader, "uModelViewProjectionMatrix", $uModelViewProjectionMatrix.m);

                
                var $uSkyMatrix: Matrix3D = new Matrix3D();
                $uSkyMatrix.m = new Float32Array([-0.05148190259933472, 0, 0.9986739158630371, 0, 0, 1, 0, 0, -0.9986739158630371, 0, -0.05148190259933472, 0, 0, 0, 0, 1])
                Scene_data.context3D.setVcMatrix4fv(this.shader, "uSkyMatrix", $uSkyMatrix.m);

                var qv3d: Vector3D = this.mathCamPos($mouseM);
                qv3d = $uSkyMatrix.transformVector(qv3d)
                Scene_data.context3D.setuniform3f(this.shader, "uCameraPosition", qv3d.x, qv3d.y, qv3d.z);

                var $uDiffuseCoefficients: Float32Array=new Float32Array([0.14585700631141663, 0.1095229983329773, 0.11986599862575531, 0, 0.0817933976650238, 0.0785657986998558, 0.10676799714565277, 0, -0.012515299953520298, -0.0038914200849831104, -0.0024973100516945124, 0, 0.1110450029373169, 0.04512010142207146, 0.015141899697482586, 0, 0.03221319988369942, 0.014369400218129158, 0.007112869992852211, -0, -0.008236129768192768, -0.005531259812414646, -0.005950029939413071, -0, -0.00837332010269165, -0.0039273700676858425, -0.0023853699676692486, 0, -0.016801999881863594, -0.0022234099451452494, 0.002148869913071394, -0, 0.040785398334264755, 0.01346640009433031, -0.0013942799996584654, 0])
                Scene_data.context3D.setVc4fv(this.shader, "uDiffuseCoefficients", $uDiffuseCoefficients);

                this.setpointLineVf()
         
            
                Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.modelBuff);
                Scene_data.context3D.renderContext.enableVertexAttribArray(0);
                Scene_data.context3D.renderContext.enableVertexAttribArray(1);
                Scene_data.context3D.renderContext.vertexAttribPointer(0, 3, Scene_data.context3D.renderContext.FLOAT, false, 32, 0);
                Scene_data.context3D.renderContext.vertexAttribPointer(1, 2, Scene_data.context3D.renderContext.FLOAT, false, 32, 12);

                Scene_data.context3D.renderContext.enableVertexAttribArray(2);
                Scene_data.context3D.renderContext.vertexAttribPointer(2, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 32, 20);
                Scene_data.context3D.renderContext.enableVertexAttribArray(3);
                Scene_data.context3D.renderContext.vertexAttribPointer(3, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 32, 24);
                Scene_data.context3D.renderContext.enableVertexAttribArray(4);
                Scene_data.context3D.renderContext.vertexAttribPointer(4, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 32, 28);

  
                Scene_data.context3D.cullFaceBack(false);
      


                Scene_data.context3D.setRenderTexture(this.shader, "tAlbedo", this._uvTextureRes.texture, 0);
                Scene_data.context3D.setRenderTexture(this.shader, "tNormal", this.normalTextRes.texture, 1);
                Scene_data.context3D.setRenderTexture(this.shader, "tReflectivity", this.imageDataReflecRes.texture, 2);
                Scene_data.context3D.setRenderTexture(this.shader, "tExtras", this.reflectivityRes.texture, 3);
                Scene_data.context3D.setRenderTexture(this.shader, "tSkySpecular", this.tSkySpecular.texture, 4);


                Scene_data.context3D.drawCall(this.kkkDisplay3DSprite.objData.indexBuffer, this.kkkDisplay3DSprite.objData.treNum);

            }

        }
        
        



    }
    private setpointLineVf(): void {
        var $positionBuffer: Float32Array = new Float32Array([24.273332595825195, 7.322669982910156, 8.924601554870605, 1, -15.372467041015625, 12.019000053405762, -7.449572563171387, 1, 20.754880905151367, 2.124569892883301, -0.09240173548460007, 1])
        var $directionBuffer: Float32Array = new Float32Array([0.95980304479599, -0.020759006962180138, 0.2799057364463806, -0.5655789971351624, 0.5836562514305115, -0.5826369524002075, 0.9903820753097534, 5.353198773150325e-9, -0.1383596807718277])
        var $colors: Float32Array = new Float32Array([12.207, 2.43907, 0.0734498, 3.04943, 2.27338, 3.54387, 1.03332, 3.84414, 4.25882])
        var $parameters: Float32Array = new Float32Array([-1, 0, 0.0225928, -1, 0, 0.0225928, -1, 0, 0.0225928])
        var $spot: Float32Array = new Float32Array([76.0396, 1, 2.63592, 96.8317, 1, 1.78738, 96.8317, 1, 1.78738])
        Scene_data.context3D.setVc4fv(this.shader, "uLightPositions", $positionBuffer);
        Scene_data.context3D.setVc3fv(this.shader, "uLightDirections", $directionBuffer);
        Scene_data.context3D.setVc3fv(this.shader, "uLightColors", $colors);
        Scene_data.context3D.setVc3fv(this.shader, "uLightParams", $parameters);
        Scene_data.context3D.setVc3fv(this.shader, "uLightSpot", $spot);
        Scene_data.context3D.setVc2f(this.shader, "uShadowKernelRotation", 0.5, 0.5);

    }


}