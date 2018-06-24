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
      let hiddenLayer = inputLayer.matMul(this.hiddenWeights)
      hiddenLayer.add(this.hiddenBias)
      hiddenLayer = hiddenLayer.sigmoid()
      let outputLayer = hiddenLayer.matMul(this.outputWeights)
      outputLayer.add(this.outputBias).sigmoid()
      outputLayer = outputLayer.sigmoid()
      output = outputLayer.dataSync()
    })
    return output
  }

  this.clone = function() {
    let nnClone = new aNN(this.inputNodes, this.hiddenNodes, this.outputNodes)
    nnClone.hiddenWeights.dispose();
    nnClone.outputWeights.dispose();
    nnClone.hiddenWeights = tf.clone(this.hiddenWeights)
    nnClone.outputWeights = tf.clone(this.outputWeights)
    nnClone.hiddenBias = tf.clone(this.hiddenBias)
    nnClone.outputBias = tf.clone(this.outputBias)
    return nnClone
  }


  this.mutate = function(rate) {
    function mutate(val) {
      if (random() < rate) {
        return random() * 2 - 1
      } else {
        return val
      }
    }
    let hw = this.hiddenWeights.dataSync()
    let ow = this.outputWeights.dataSync()
    let hb = this.hiddenBias.dataSync()
    let ob = this.outputBias.dataSync()
    console.log(hw)
    console.log(hw.map(mutate))
    this.hiddenWeights = tf.tensor(hw.map(mutate), [this.inputNodes, this.hiddenNodes])
    this.outputWeights = tf.tensor(ow.map(mutate), [this.hiddenNodes, this.outputNodes])
    this.hiddenBias = tf.tensor(hb.map(mutate), [this.inputNodes, this.hiddenNodes])
    this.outputBias = tf.tensor(ob.map(mutate), [this.hiddenNodes, this.outputNodes])
  }
}
