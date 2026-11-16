import Particles, { ParticlesProvider } from "@tsparticles/react";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

// Module scope: ParticlesProvider requires a stable init, and Particles
// reloads whenever the options reference changes
const initParticles = async (engine: Engine) => {
  await loadSlim(engine);
};

const options: ISourceOptions = {
  fullScreen: { enable: false },
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: { value: 60, density: { enable: true } },
    color: { value: "#888888" },
    shape: { type: "square" },
    opacity: { value: { min: 0.2, max: 0.6 } },
    size: { value: { min: 2, max: 5 } },
    links: {
      enable: true,
      color: "#888888",
      distance: 140,
      opacity: 0.25,
      width: 1,
    },
    move: {
      enable: true,
      direction: "none",
      random: true,
      speed: 1.2,
      outModes: { default: "out" },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
    },
    modes: {
      repulse: { distance: 100 },
    },
  },
};

export default function AuthParticles() {
  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        id="auth-particles"
        options={options}
        className="absolute inset-0"
      />
    </ParticlesProvider>
  );
}
