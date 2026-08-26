/**
 * BENYAMIN NAMTALASHVILI — FIGMA MULTIPLAYER GHOST INTERVENTION TEXT COMPONENT
 * Built with GSAP & GSAP Draggable + GSAP Timeline
 * Sequence:
 * 1. User drags text block and drops it anywhere (no auto-snap).
 * 2. Draggable is locked.
 * 3. Ghost cursor ("Benyamin") flies in to the BOTTOM-RIGHT CORNER of the component.
 * 4. Ghost cursor grabs the bottom-right corner and drags the block back to (0, 0).
 * 5. Progressive Escalating Scolding Messages Cycle:
 *    - 1st drag: "DO NOT Drag that"
 *    - 2nd drag: "I'm watching you"
 *    - 3rd drag: "Hey stop it."
 *    - 4th drag: "I'm angry now"
 * 6. After 1.5s, chat closes, ghost flies offscreen.
 * 7. Warning "jiggle" shake animation on text block.
 * 8. Draggable re-enabled for user.
 */

(function () {
  'use strict';

  function initFigmaGhostIntervention() {
    if (typeof gsap === 'undefined' || typeof Draggable === 'undefined') return;
    gsap.registerPlugin(Draggable);

    const wrappers = document.querySelectorAll('.figma-drag-text-wrapper');
    if (!wrappers || wrappers.length === 0) return;

    // Ordered escalating scolding messages
    const scoldingMessages = [
      "DO NOT Drag that",
      "I saw that",
      "HA! caught you pixel thief",
      "I'm watching you",
      "Hey stop it.",
      "Yep still watching you.",
      "I'm angry now"
    ];

    let dragCount = 0;

    wrappers.forEach((wrapper) => {
      const draggableBox = wrapper.querySelector('.figma-draggable-box');
      const userCursor = wrapper.querySelector('.figma-user-cursor');
      const ghostCursor = wrapper.querySelector('.figma-ghost-cursor');
      const ghostChatBubble = wrapper.querySelector('.figma-ghost-chat-bubble');

      if (!draggableBox) return;

      let isIntervening = false;
      let draggableInstance = null;

      // 1. User Multiplayer Cursor (Pointer only, tracks mouse inside wrapper)
      if (userCursor && !('ontouchstart' in window)) {
        const cursorX = gsap.quickTo(userCursor, "x", { duration: 0.08, ease: "power2.out" });
        const cursorY = gsap.quickTo(userCursor, "y", { duration: 0.08, ease: "power2.out" });

        wrapper.addEventListener('mouseenter', () => {
          if (!isIntervening) userCursor.classList.add('is-active');
        });

        wrapper.addEventListener('mouseleave', () => {
          userCursor.classList.remove('is-active');
        });

        wrapper.addEventListener('mousemove', (e) => {
          const rect = wrapper.getBoundingClientRect();
          cursorX(e.clientX - rect.left);
          cursorY(e.clientY - rect.top);
        });
      }

      // 2. GSAP Draggable & Ghost Intervention Sequence
      const draggables = Draggable.create(draggableBox, {
        type: "x,y",
        edgeResistance: 0.15,
        cursor: "url('assets/custom-cursor.svg') 4 3, auto",
        activeCursor: "url('assets/custom-cursor.svg') 4 3, auto",
        force3D: true,
        zIndexBoost: true,

        onPress: function () {
          draggableBox.classList.add('is-dragging');
          if (userCursor) userCursor.classList.add('is-dragging');
        },

        onRelease: function () {
          draggableBox.classList.remove('is-dragging');
          if (userCursor) userCursor.classList.remove('is-dragging');

          const distanceMoved = Math.hypot(this.x, this.y);

          // If barely clicked without moving, do nothing
          if (distanceMoved < 12) return;

          // Lock user interaction during ghost intervention sequence
          isIntervening = true;
          this.disable();
          if (userCursor) userCursor.classList.remove('is-active');

          const droppedX = this.x;
          const droppedY = this.y;

          // Position at the BOTTOM-RIGHT CORNER of the draggable box
          const cornerOffsetX = draggableBox.offsetWidth - 24;
          const cornerOffsetY = draggableBox.offsetHeight - 18;

          // Cycle through the escalating messages in order
          const currentMsg = scoldingMessages[dragCount % scoldingMessages.length];
          const isAngry = currentMsg === "I'm angry now";
          dragCount++;

          if (ghostChatBubble) {
            ghostChatBubble.textContent = currentMsg;
            if (isAngry) {
              ghostChatBubble.style.borderColor = "#FF3333";
              ghostChatBubble.style.boxShadow = "0 16px 36px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(255, 51, 51, 0.5)";
            } else {
              ghostChatBubble.style.borderColor = "rgba(255, 255, 255, 0.22)";
              ghostChatBubble.style.boxShadow = "0 16px 36px rgba(0, 0, 0, 0.55), 0 4px 16px rgba(147, 51, 234, 0.4)";
            }
          }

          // Trigger Master GSAP Choreography Timeline
          const tl = gsap.timeline({
            onComplete: () => {
              isIntervening = false;
              draggableInstance.enable();
              draggableInstance.update();
            }
          });

          // Step 1: Ghost Cursor Appears & Flies In directly to the Bottom-Right Corner
          if (ghostCursor) {
            tl.set(ghostCursor, {
              x: droppedX + cornerOffsetX + 120,
              y: droppedY + cornerOffsetY + 100,
              opacity: 0,
              scale: 0.7,
              display: 'flex'
            });

            tl.to(ghostCursor, {
              x: droppedX + cornerOffsetX,
              y: droppedY + cornerOffsetY,
              opacity: 1,
              scale: 1,
              duration: 0.55,
              ease: "power3.out"
            });

            // Ghost Grabs the Corner (Tactile press & scale)
            tl.to(ghostCursor, {
              scale: 0.92,
              duration: 0.1,
              ease: "power1.in"
            });
          }

          tl.to(draggableBox, {
            boxShadow: isAngry ? "0 20px 50px rgba(255, 51, 51, 0.35)" : "0 18px 48px rgba(255, 140, 0, 0.28)",
            borderColor: isAngry ? "#FF3333" : "#FF8C00",
            duration: 0.1
          }, "<");

          // Step 2: The Correction Drag — Both Move Smoothly back to (0, 0)
          tl.to(draggableBox, {
            x: 0,
            y: 0,
            duration: isAngry ? 0.7 : 0.85,
            ease: isAngry ? "power3.inOut" : "power2.inOut"
          });

          if (ghostCursor) {
            tl.to(ghostCursor, {
              x: cornerOffsetX,
              y: cornerOffsetY,
              duration: isAngry ? 0.7 : 0.85,
              ease: isAngry ? "power3.inOut" : "power2.inOut"
            }, "<");
          }

          // Sync internal Draggable coordinates
          tl.add(() => {
            gsap.set(draggableBox, { x: 0, y: 0 });
            draggableInstance.update();
          });

          // Step 3: High-Visibility Scolding Message Pops Open
          if (ghostChatBubble) {
            tl.to(ghostChatBubble, {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "back.out(1.8)"
            });

            // Step 4: 1.5s Reading Delay (Unobstructed message)
            tl.to({}, { duration: 1.5 });

            // Step 5: Chat Bubble Disappears
            tl.to(ghostChatBubble, {
              opacity: 0,
              scale: 0.85,
              y: 6,
              duration: 0.2,
              ease: "power2.in"
            });
          }

          // Step 6: Ghost Cursor Flies Back Offscreen
          if (ghostCursor) {
            tl.to(ghostCursor, {
              x: cornerOffsetX + 280,
              y: cornerOffsetY + 180,
              opacity: 0,
              scale: 0.6,
              duration: 0.6,
              ease: "power3.in"
            });
          }

          // Step 7: Physical Warning Jiggle Shake (Extra intense if angry!)
          const shakeIntensity = isAngry ? 12 : 8;
          const rotIntensity = isAngry ? 2.2 : 1.4;

          tl.to(draggableBox, {
            keyframes: [
              { x: -shakeIntensity, rotation: -rotIntensity, duration: 0.04 },
              { x: shakeIntensity, rotation: rotIntensity, duration: 0.04 },
              { x: -(shakeIntensity * 0.75), rotation: -(rotIntensity * 0.7), duration: 0.04 },
              { x: (shakeIntensity * 0.75), rotation: (rotIntensity * 0.7), duration: 0.04 },
              { x: -(shakeIntensity * 0.4), rotation: -(rotIntensity * 0.3), duration: 0.04 },
              { x: (shakeIntensity * 0.4), rotation: (rotIntensity * 0.3), duration: 0.04 },
              { x: 0, rotation: 0, duration: 0.04 }
            ],
            ease: "power1.inOut"
          }, "-=0.35");
        }
      });

      draggableInstance = draggables[0];
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFigmaGhostIntervention);
  } else {
    initFigmaGhostIntervention();
  }
})();
