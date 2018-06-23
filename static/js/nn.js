function aNN(input, hidden, output) {

  this.inputNodes = input
  this.hiddenNodes = hidden
  this.outputNodes = output

  this.hiddenWeights = tf.randomNormal([this.inputNodes, this.hiddenNodes])
  this.outputWeights = tf.randomNormal([this.hiddenNodes, this.outputNodes])

  this.hiddenBias = tf.randomNormal([this.inputNodes, this.hiddenNodes])
  this.outputBias = tf.randomNormal([this.hiddenNodes, this.outputNodes])

  this.predict = function(input) {
    let output
    tf.tidy(() => {
      let inputLayer = tf.tensor(input, [1, this.inputNodes])
      let hiddenLayer = inputLayer.matMul(this.hiddenWeights).sigmoid()
      hiddenLayer.add(this.hiddenBias)
      let outputLayer = hiddenLayer.matMul(this.outputWeights).sigmoid()
      outputLayer.add(this.outputBias)
      output = outputLayer.dataSync()
    })
    return output
  }

  this.clone = function() {
    let nnClone = new aNN(this.inputNodes, this.hiddenNodes, this.outputNodes)
    nnClone.hiddenWeights.dispose();
    nnClone.outputWeights.dispose
    nnClone.hiddenWeights = tf.clone(this.hiddenWeights)
    nnClone.outputWeights = tf.clone(this.outputWeights)
    return nnClone
  }

}
