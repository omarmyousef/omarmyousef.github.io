function switch_tab(e, tab) {
    let target = (e.target || e.srcElement || e).parentElement.parentElement;
    main_container.src = tab;
}

let main_container = document.getElementById("main-container");

window.addEventListener("resize", main_container_idcard);

function navmenu_action(tab) {
    document.querySelector(".navmenu-current").classList.remove("navmenu-current");
    document.querySelector(`.navmenu-element[tab="${tab}"]`).classList.add("navmenu-current");
    if (tab != "/html/home.html") {
        main_container.classList.add("main-container-expand")
    } else {
        main_container.classList.remove("main-container-expand")
        main_container_idcard()
    }
}

function main_container_idcard(){

    if( window.innerWidth <= 900 ){
        main_container.classList.add("main-container-expand");
        main_container.contentDocument.querySelector("iframe.idcard-iframe").style.display = "flex";
        main_container.contentDocument.querySelector("iframe.idcard-iframe").style.height = `${main_container.contentDocument.querySelector("iframe.idcard-iframe").contentDocument.querySelector(".home-top").getBoundingClientRect().height }px`;
    }else{
        if( main_container.src.includes("home.html") ){
            main_container.classList.remove("main-container-expand");
            main_container.contentDocument.querySelector("iframe.idcard-iframe").style.display = "none";
        }
    }
}

/// bg
const particleVertex = `
  attribute float scale;
	uniform float uTime;

	void main() {
		vec3 p = position;
    float s = scale;

    p.y += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
    p.x += (sin(p.y + uTime) * 0.5);
    s += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;

		vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
		gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`;

const particleFragment = `
	void main() {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
	}
`;

function lerp(start, end, amount) {
	return (1 - amount) * start + amount * end;
};

class Canvas {
	constructor() {
		this.config = {
			canvas: document.querySelector('#c'),
			winWidth: window.innerWidth,
			winHeight: window.innerHeight,
			aspectRatio: window.innerWidth / window.innerHeight,
			mouse: new THREE.Vector2(-10, -10)
		};

		this.onResize = this.onResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
		this.animate = this.animate.bind(this);

		this.initCamera();
		this.initScene();
		this.initRenderer();

		this.initParticles();

		this.bindEvents();
		this.animate();
	}

	bindEvents() {
		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousemove', this.onMouseMove, false);
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(75, this.config.aspectRatio, 0.01, 1000);
		this.camera.position.set(0, 6, 5);
	}

	initControls() {
		this.controls = new OrbitControls(this.camera, this.config.canvas);
	}

	initScene() {
		this.scene = new THREE.Scene();
	}

	initRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.config.canvas,
			antialias: true,
      // alpha: true
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.config.winWidth, this.config.winHeight);
	}

	initParticles() {
    const gap = 0.3;
    const amountX = 200;
    const amountY = 200;
    const particleNum = amountX * amountY;
		const particlePositions = new Float32Array(particleNum * 3);
    const particleScales = new Float32Array(particleNum);
    let i = 0;
    let j = 0;

    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        particlePositions[i] = ix * gap - ((amountX * gap) / 2);
        particlePositions[i + 1] = 0;
        particlePositions[i + 2] = iy * gap - ((amountX * gap) / 2);
        particleScales[j] = 1;
        i += 3;
        j++;
      }
    }

		this.particleGeometry = new THREE.BufferGeometry();
		this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    this.particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

		this.particleMaterial = new THREE.ShaderMaterial({
			transparent: true,
			vertexShader: particleVertex,
			fragmentShader: particleFragment,
			uniforms: {
				uTime: { type: 'f', value: 0 }
			}
		});
		this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
		this.scene.add(this.particles);
	}

	render() {
		this.camera.lookAt(this.scene.position);
		this.renderer.render(this.scene, this.camera);
	}

	animate() {
		this.particleMaterial.uniforms.uTime.value += 0.05;
		requestAnimationFrame(this.animate);
		this.render();
	}

	onMouseMove(e) {
		this.config.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		this.config.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
	}

	onResize() {
		this.config.winWidth = window.innerWidth;
		this.config.winHeight = window.innerHeight;
		this.camera.aspect = this.config.winWidth / this.config.winHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.config.winWidth, this.config.winHeight);
	}
}

new Canvas();