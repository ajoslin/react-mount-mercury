'use strict'

var React = require('react')
var mainLoopApp = require('main-loop-app')

var nextId = 0

module.exports = createMercuryWrapper

function createMercuryWrapper (observState, render) {
  var key = 'mercury-wrapper-' + (nextId++)

  function Cmp (props) {
    React.Component.call(this, props)
    var self = this

    self.renderChild = function (state) {
      return render(state, self.props.childProps)
    }

    self.handleRootRef = function (node) {
      if (node && !self.rootNode) {
        self.rootNode = node
        self.unmountChild = mainLoopApp(node, observState, self.renderChild)
      }
    }
  }

  Cmp.prototype = Object.create(React.Component.prototype)

  Cmp.prototype.componentWillUnmount = function () {
    if (this.unmountChild) this.unmountChild()
  }

  Cmp.prototype.render = function () {
    return React.createElement('div', {
      key: key,
      ref: this.handleRootRef,
      className: this.props.className || '',
      style: this.props.style || {}
    })
  }

  return Cmp
}
