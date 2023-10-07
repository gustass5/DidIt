import type { ISourceOptions } from "tsparticles-engine";

export const particleOptions = {
	background: {
		color: {
			value: '#121212'
		}
	},
	fpsLimit: 60,
	interactivity: {
		detectsOn: 'canvas',
		events: {
			onClick: {
				enable: false
			},
			onHover: {
				enable: false,
				mode: 'repulse'
			},
			resize: true
		}
	},
	particles: {
		color: {
			value: '#fb923c'
		},
		links: {
			enable: false
		},
		collisions: {
			enable: true
		},
		move: {
			direction: 'top',
			enable: true,
			outMode: 'out',
			random: true,
			speed: 1,
			straight: false
		},
		number: {
			density: {
				enable: true,
				value_area: 125
			},
			value: 6
		},
		opacity: {
			value: 0.65,
			random: true
		},
		shape: {
			type: 'triangle'
		},
		size: {
			random: true,
			value: 5
		}
	},
	detectRetina: true
} satisfies ISourceOptions;
