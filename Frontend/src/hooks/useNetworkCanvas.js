import { useEffect } from "react";

export function useNetworkCanvas(canvasId = "network-canvas") {
  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    let rafId;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        n.pulse += 0.02;
        const glow = (Math.sin(n.pulse) + 1) * 0.5;
        const alpha = 0.4 + glow * 0.4;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fill();

        if (n.r > 3) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,1,2,${alpha * 0.7})`;
          ctx.fill();
        }

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      rafId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [canvasId]);
}
