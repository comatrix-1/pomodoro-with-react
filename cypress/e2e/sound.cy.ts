describe("Sound functionality", () => {
  beforeEach(() => {
    cy.visit("/index.html", {
      onBeforeLoad(win) {
        cy.stub(win.HTMLAudioElement.prototype, "play").as("audioPlay");
        cy.stub(win.HTMLAudioElement.prototype, "load").as("audioLoad");
      },
    });
  });

  const setTimerTo = (minutes: number, seconds: number) => {
    // Use native input value setter to properly update React controlled inputs
    cy.get('input[type="number"]').first().then(($el) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )!.set!;
      nativeInputValueSetter.call($el[0], String(minutes));
      $el[0].dispatchEvent(new Event("input", { bubbles: true }));
      $el[0].dispatchEvent(new Event("change", { bubbles: true }));
    });
    cy.get('input[type="number"]').last().then(($el) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )!.set!;
      nativeInputValueSetter.call($el[0], String(seconds));
      $el[0].dispatchEvent(new Event("input", { bubbles: true }));
      $el[0].dispatchEvent(new Event("change", { bubbles: true }));
    });
    cy.contains("button", "Set timer").click();
  };

  it("should load the audio file on page load", () => {
    cy.get("@audioLoad").should("have.been.calledOnce");
  });

  it("should play sound when timer reaches zero", () => {
    // Set timer to 0 minutes and 1 second
    setTimerTo(0, 1);

    // Click START
    cy.contains("button", "START").click();

    // Wait for timer to reach 0 and audio to play (allow up to 5 seconds)
    cy.get("@audioPlay", { timeout: 5000 }).should("have.been.calledOnce");

    // Verify title changes to "Time's up!"
    cy.title().should("include", "Time's up!");
  });

  it("should not play sound when timer is paused before reaching zero", () => {
    // Set timer to 0 minutes and 3 seconds
    setTimerTo(0, 3);

    // Click START then PAUSE after 1 second
    cy.contains("button", "START").click();
    cy.wait(1000);
    cy.contains("button", "PAUSE").click();

    // Wait and ensure audio was not played
    cy.wait(3000);
    cy.get("@audioPlay").should("not.have.been.called");
  });

  it("should play sound again after reset and timer reaches zero", () => {
    // Set timer to 0 minutes and 1 second
    setTimerTo(0, 1);

    // Start timer
    cy.contains("button", "START").click();

    // Wait for first play
    cy.get("@audioPlay", { timeout: 5000 }).should("have.been.calledOnce");

    // Reset timer (this clears alarmPlayed state)
    cy.contains("button", "RESET").click();

    // Set timer again to 1 second
    setTimerTo(0, 1);

    // Start again
    cy.contains("button", "START").click();

    // Wait for second play
    cy.get("@audioPlay", { timeout: 5000 }).should("have.been.calledTwice");
  });
});
