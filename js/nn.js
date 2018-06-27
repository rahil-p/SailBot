function aNN(input, hidden, output, input2, output2) {

  this.inputNodes = input
  this.hiddenNodes = hidden
  this.outputNodes = output

  this.inputNodes2 = input2
  this.outputNodes2 = output2

  this.hiddenWeights = tf.randomNormal([this.inputNodes, this.hiddenNodes])
  this.outputWeights = tf.randomNormal([this.hiddenNodes, this.outputNodes])
  this.hiddenBias = tf.randomNormal([this.inputNodes, this.hiddenNodes])
  this.outputBias = tf.randomNormal([this.hiddenNodes, this.outputNodes])
//
  this.outputWeights2 = tf.randomNormal([this.inputNodes2, this.outputNodes2])
  this.outputBias2 = tf.randomNormal([this.inputNodes2, this.outputNodes2])
//
  this.predict = function(input) {
    let output
    tf.tidy(() => {
      let inputLayer = tf.tensor(input.slice(0,2), [1, this.inputNodes])
      let hiddenLayer = inputLayer.matMul(this.hiddenWeights)
      hiddenLayer.add(this.hiddenBias)
      hiddenLayer = hiddenLayer.tanh().abs()
      let outputLayer = hiddenLayer.matMul(this.outputWeights)
      outputLayer.add(this.outputBias)
      outputLayer = outputLayer.tanh().abs()
      output = outputLayer.dataSync()

      let inputLayer2 = tf.tensor([input[4]], [1, 1])
      let outputLayer2 = inputLayer2.matMul(this.outputWeights2)
      outputLayer2.add(this.outputBias2)
      outputLayer2 = outputLayer2.tanh().abs()
      output2 = outputLayer2.dataSync()
    })
    return [output, output2]
  }

  this.clone = function() {
    let nnClone = new aNN(this.inputNodes, this.hiddenNodes, this.outputNodes,
                          this.inputNodes2, this.outputNodes2)
    nnClone.hiddenWeights.dispose();
    nnClone.outputWeights.dispose();
    nnClone.hiddenBias.dispose();
    nnClone.outputBias.dispose();
    nnClone.outputWeights2.dispose();
    nnClone.outputBias2.dispose();

    nnClone.hiddenWeights = tf.clone(this.hiddenWeights)
    nnClone.outputWeights = tf.clone(this.outputWeights)
    nnClone.hiddenBias = tf.clone(this.hiddenBias)
    nnClone.outputBias = tf.clone(this.outputBias)
    nnClone.outputWeights2 = tf.clone(this.outputWeights2)
    nnClone.outputBias2 = tf.clone(this.outputBias2)
    return nnClone
  }

  this.mutate = function(rate) {
    function mutate(val) {
      if (random() < rate) {
        return val + randomGaussian(0, 0.1)//random() * 2 - 1
      } else {
        return val
      }
    }

    let hw = this.hiddenWeights.dataSync()
    let ow = this.outputWeights.dataSync()
    let hb = this.hiddenBias.dataSync()
    let ob = this.outputBias.dataSync()
    let ow2 = this.outputWeights2.dataSync()
    let ob2 = this.outputBias2.dataSync()

    this.hiddenWeights.dispose();
    this.outputWeights.dispose();
    this.hiddenBias.dispose();
    this.outputBias.dispose();
    this.outputWeights2.dispose();
    this.outputBias2.dispose();

    this.hiddenWeights = tf.tensor(hw.map(mutate), [this.inputNodes, this.hiddenNodes])
    this.outputWeights = tf.tensor(ow.map(mutate), [this.hiddenNodes, this.outputNodes])
    this.hiddenBias = tf.tensor(hb.map(mutate), [this.inputNodes, this.hiddenNodes])
    this.outputBias = tf.tensor(ob.map(mutate), [this.hiddenNodes, this.outputNodes])
    this.outputWeights2 = tf.tensor(ow2.map(mutate), [this.inputNodes2, this.outputNodes2])
    this.outputBias2 = tf.tensor(ob2.map(mutate), [this.inputNodes2, this.outputNodes2])
  }

  this.crossover = function(otherBrain) {
    let hw = this.hiddenWeights.dataSync()
    let hw_o = otherBrain.hiddenWeights.dataSync()
    let ow = this.outputWeights.dataSync()
    let ow_o = otherBrain.outputWeights.dataSync()
    let hb = this.hiddenBias.dataSync()
    let hb_o = otherBrain.hiddenBias.dataSync()
    let ob = this.outputBias.dataSync()
    let ob_o = otherBrain.outputBias.dataSync()
    let ow2 = this.outputWeights2.dataSync()
    let ow2_o = otherBrain.outputWeights2.dataSync()
    let ob2 = this.outputBias2.dataSync()
    let ob2_o = otherBrain.outputBias2.dataSync()

    this.hiddenWeights.dispose();
    this.outputWeights.dispose();
    this.hiddenBias.dispose();
    this.outputBias.dispose();
    this.outputWeights2.dispose();
    this.outputBias2.dispose();

    let orig = [hw, ow, hb, ob, ow2, ob2]
    let other = [hw_o, ow_o, hb_o, ob_o, ow2_o, ob2_o]

    // specific to this use case
    for (i = 0; i < orig.length; i++) {
      r = random()
      if (r > .5) {
        orig[i] = other[i]
      }
    }

    this.hiddenWeights = tf.tensor(orig[0], [this.inputNodes, this.hiddenNodes])
    this.outputWeights = tf.tensor(orig[1], [this.hiddenNodes, this.outputNodes])
    this.hiddenBias = tf.tensor(orig[2], [this.inputNodes, this.hiddenNodes])
    this.outputBias = tf.tensor(orig[3], [this.hiddenNodes, this.outputNodes])
    this.outputWeights2 = tf.tensor(orig[4], [this.inputNodes2, this.outputNodes2])
    this.outputBias2 = tf.tensor(orig[5], [this.inputNodes2, this.outputNodes2])
  }
}
