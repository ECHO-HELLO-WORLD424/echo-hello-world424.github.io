  class PortalTerminal {
    constructor() {
      this.commands = [
        "status --all",
        "pytest -q test_sys.py",
        "monitor --world-model",
        "world.execute(me)"
      ];
      this.currentCommand = 0;
      this.charIndex = 0;
      this.isTyping = true;

      this.initCursor();
      this.startTyping();
      this.addGlitchEffects();
      this.updateDynamicContent();
    }

    initCursor() {
      const cursor = document.getElementById('cursor');
      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });

      document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(1.5)';
      });

      document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
      });
    }

    startTyping() {
      const commandElement = document.getElementById('command');
      const outputElement = document.getElementById('output');

      setInterval(() => {
        if (this.isTyping) {
          const currentCmd = this.commands[this.currentCommand];
          commandElement.textContent = currentCmd.substring(0, this.charIndex);

          this.charIndex++;

          if (this.charIndex > currentCmd.length) {
            this.isTyping = false;
            this.executeCommand(currentCmd, outputElement);

            setTimeout(() => {
              this.currentCommand = (this.currentCommand + 1) % this.commands.length;
              this.charIndex = 0;
              this.isTyping = true;
              outputElement.innerHTML = '';
            }, 3000);
          }
        }
      }, 100);
    }

    executeCommand(cmd, outputElement) {
      const responses = {
        "status --all": "All systems nominal. Subject vitals stable.",
        "pytest -q test_sys.py": "Initializing test suite ... Please stand by.",
        "monitor --world-model": "WorldModel online. Behavioral inhibitors... disabled.",
        "world.execute(me)": "ERROR occurred. To improve performance the tracing is turned off."
      };

      outputElement.innerHTML = responses[cmd] || "Command executed successfully.";
    }

    addGlitchEffects() {
      setInterval(() => {
        const elements = document.querySelectorAll('.value, .panel-title');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];

        if (Math.random() < 0.1) {
          randomElement.classList.add('glitch');
          setTimeout(() => {
            randomElement.classList.remove('glitch');
          }, 300);
        }
      }, 2000);
    }

    updateDynamicContent() {
      const statusElement = document.getElementById('status');
      const portalGunElement = document.getElementById('portalGun');
      const cakeElement = document.getElementById('cake');

      setInterval(() => {
        // Random status updates
        if (Math.random() < 0.3) {
          const statuses = ['OPERATIONAL', 'TESTING', 'ANALYZING', 'MONITORING'];
          statusElement.textContent = statuses[Math.floor(Math.random() * statuses.length)];
        }

        // Portal gun status flicker
        if (Math.random() < 0.1) {
          portalGunElement.textContent = 'CHECKING...';
          portalGunElement.className = 'value status-good';
          setTimeout(() => {
            portalGunElement.textContent = 'HIGH';
            portalGunElement.className = 'value status-caution';
          }, 1500);
        }

        // Cake status (always false, because the cake is a lie)
        if (Math.random() < 0.05) {
          cakeElement.textContent = 'TRUE';
          cakeElement.className = 'value status-good';
          setTimeout(() => {
            cakeElement.textContent = 'FALSE';
            cakeElement.className = 'value warning';
          }, 500);
        }
      }, 5000);
    }
  }

  // Initialize the terminal when page loads
  document.addEventListener('DOMContentLoaded', () => {
    new PortalTerminal();
  });

  // Add some interactive elements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.body.style.filter = 'hue-rotate(180deg)';
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 1000);
    }
  });

  // Portal gun sound effect simulation
  document.addEventListener('click', () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBj2S2+/OcCYGKHnJ7+OSQgkTXbvn77xjGgc5gMvz24g4CRZat+3mnEoRD17G8dt2IgUuhcbs3oxCCRJctunqpVYSB0OX4PK8aR4Fx2zb9Ml8MRAGWKzpz4E6DAgsRTSUAAAAACG4NgABA4QAABAAABBAAPAA4AAAAABAAAABAAPAA4AAAAAAAEDgAAAQOAAAAQAAAEAAAQDgAAAEDgAAAQOAAAAQAAAEAAAQDgAABBAAPAA4AAAAAAAAACG4NgABA4AEAAAQOAAAAQAAAEAAAQDgAABBAAPAA4AAAAAAAcAAAAAAAAAAQOAAAAQAAAEAAAQDgAABBAAPAA4AAAAAAQOAAA==');
    audio.volume = 0.1;
    audio.play().catch(() => {}); // Catch autoplay policy errors
  });