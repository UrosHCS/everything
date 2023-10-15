type StreamData = {
  message: string;
  conversationId: string;
  isNewConversation: boolean;
  isErrorMessage: boolean;
};

export class StreamHandler {
  private expectNewConversationId: boolean;

  constructor(
    private stream: ReadableStreamDefaultReader<Uint8Array>,
    private conversationId: string | undefined,
    private onAnswerChunk: (chunk: string) => void,
  ) {
    this.expectNewConversationId = !conversationId;
  }

  async read(): Promise<StreamData> {
    try {
      return await this.readOrThrow();
    } catch (errror: unknown) {
      return {
        message: "Sorry, I can't give you an answer right now. My brain is fried. Hopefully someone will fix it soon.",
        conversationId: '',
        isNewConversation: false,
        isErrorMessage: true,
      };
    }
  }

  /**
   * @throws {Error} If the stream is not in the expected format.
   */
  async readOrThrow(): Promise<StreamData> {
    let message = '';
    let isFirstChunk = true;

    // Push the response to the streamed message
    while (true) {
      const { done, value } = await this.stream.read();
      if (done) break;

      let decoded = new TextDecoder('utf-8').decode(value);
      if (isFirstChunk) {
        isFirstChunk = false;
        decoded = this.handleFirstChunkOrThrow(decoded);
      }

      if (!decoded) continue;

      message += decoded;
      this.onAnswerChunk(decoded);
    }

    return {
      message,
      /**
       * The convesationId should always be truthy at this point, because either
       * it was passed in the constructor, or it was set in the first chunk.
       */
      conversationId: this.conversationId!,
      isNewConversation: this.expectNewConversationId,
      isErrorMessage: false,
    };
  }

  private handleFirstChunkOrThrow(decoded: string): string {
    const [prefix, conversationId, messageChunk] = decoded.split(':', 3);
    if (prefix !== 'conversationId' || !conversationId) {
      throw new Error(`First chunk should be "conversationId:{id}", but got "${decoded}"`);
    }

    this.conversationId = conversationId;

    return messageChunk ?? '';
  }
}
