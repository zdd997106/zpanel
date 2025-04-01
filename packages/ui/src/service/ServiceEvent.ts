const { window } = globalThis;

// ----------

export default class ServiceEvent extends CustomEvent<never> {
  // --- METHODS ---

  /**
   * Method to dispatch the custom event to a given target (default is the global window object)
   */
  public dispatch(target: Target = window) {
    target.dispatchEvent(new CustomEvent(this.type));
  }

  /**
   * Method to create an event listener to the event type associated with the instance,
   * and return with a function to remove the listener.
   */
  public createListener = (callback: VoidFunction, targets: Target[] = [window]): ClearListener => {
    // Add event listener to each target in the 'targets' array.
    targets.forEach((target) => {
      target?.addEventListener(this.type, callback);
    });

    // Return a function to remove the event listener from each target.
    return () => {
      targets.forEach((target) => {
        target?.removeEventListener(this.type, callback);
      });
    };
  };

  // --- HELPERS: FUNCTIONS TO CREATE INSTANCE ---

  /**
   * Creates an instance of ServiceEvent for handling request unauthenticated event
   */
  static createRequestUnauthenticatedEvent = () => {
    return new ServiceEvent('request-unauthenticated');
  };

  /**
   * Creates an instance of ServiceEvent for handling request forbidden event
   */
  static createRequestForbiddenEvent = () => {
    return new ServiceEvent('request-forbidden');
  };
}

// ----- INTERNAL TYPES -----

type Target = Window | Element;

interface ClearListener {
  (): void;
}
