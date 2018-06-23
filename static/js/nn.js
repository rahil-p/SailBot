function aNN(input, hidden, output) {

  this.inputNodes = input
  this.hiddenNodes = hidden
  this.outputNodes = output

  this.inputWeights = tf.randomNormal([this.inputNodes, this.hiddenNodes])
  this.outputWeights = tf.randomNormal([this.hiddenNodes, this.outputNodes])

  this.predict = function(input) {
    let output
    tf.tidy(() => {
      let inputLayer = tf.tensor(input, [1, this.inputNodes])
      let hiddenLayer = inputLayer.matMul(this.inputWeights).sigmoid()
      let outputLayer = hiddenLayer.matMul(this.outputWeights).sigmoid()
      output = outputLayer.dataSync()
    })
    return output
  }

  this.clone = function() {
    let nnClone = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes)
    nnClone.dispose();
    nnClone.inputWeights = tf.clone(this.inputWeights)
    nnClone.outputWeights = tf.clone(this.outputWeights)
    return nnClone
  }

  this.dispose = function() {
    this.inputWeights.dispose();
    this.outputWeigths.dispose();
  }
}
