export class HuggingFaceAPI {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api-inference.huggingface.co/models'
  }

  async query(model, inputs, options = {}) {
    const response = await fetch(`${this.baseUrl}/${model}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs,
        options: {
          wait_for_model: true,
          ...options
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  }

  async chat(messages, model = 'microsoft/DialoGPT-medium') {
    const conversation = messages.map(msg => msg.content).join('\n')
    try {
      const response = await this.query(model, conversation)
      return response[0]?.generated_text || "I'm having trouble responding right now."
    } catch (error) {
      console.error('HuggingFace API error:', error)
      return "I apologize, but I'm experiencing technical difficulties. Please try again."
    }
  }
}