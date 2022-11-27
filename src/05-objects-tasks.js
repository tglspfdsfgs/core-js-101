/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() { return this.width * this.height; },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  order: 0,

  element(value) {
    this.checkOrder(1);
    if (this.elem) this.occurError();
    const selector = { ...this };
    selector.elem = `${value}`;
    selector.order = 1;
    return selector;
  },

  id(value) {
    this.checkOrder(2);
    if (this.ID) this.occurError();
    const selector = { ...this };
    selector.ID = `#${value}`;
    selector.order = 2;
    return selector;
  },

  class(value) {
    this.checkOrder(3);
    const selector = { ...this };
    if (selector.classes) {
      selector.classes += `.${value}`;
    } else {
      selector.classes = `.${value}`;
      selector.order = 3;
    }
    return selector;
  },

  attr(value) {
    this.checkOrder(4);
    const selector = { ...this };
    if (selector.attribute) {
      selector.attribute += `[${value}]`;
    } else {
      selector.attribute = `[${value}]`;
      selector.order = 4;
    }
    return selector;
  },

  pseudoClass(value) {
    this.checkOrder(5);
    const selector = { ...this };
    if (selector.pseudoClasses) {
      selector.pseudoClasses += `:${value}`;
    } else {
      selector.pseudoClasses = `:${value}`;
      selector.order = 5;
    }
    return selector;
  },

  pseudoElement(value) {
    this.checkOrder(6);
    if (this.pseudoElem) this.occurError();
    const selector = { ...this };
    selector.pseudoElem = `::${value}`;
    selector.order = 6;
    return selector;
  },

  stringify() {
    const str = `${this.elem ? this.elem : ''}
    ${this.ID ? this.ID : ''}
    ${this.classes ? this.classes : ''}
    ${this.attribute ? this.attribute : ''}
    ${this.pseudoClasses ? this.pseudoClasses : ''}
    ${this.pseudoElem ? this.pseudoElem : ''}`.replaceAll('\n', '').replaceAll(' ', '');

    return `${this.prev ? this.prev : ''}${str}`;
  },

  combine(selector1, combinator, selector2) {
    const sel2 = selector2;
    if (!sel2.prev) {
      sel2.prev = `${selector1.stringify()} ${combinator} `;
    } else if (!sel2.isCombined) {
      sel2.prev += `${selector1.stringify()} ${combinator} `;
    } else {
      sel2.prev = `${selector1.stringify()} ${combinator} ${sel2.prev}`;
    }
    sel2.isCombined = true;

    return sel2;
  },

  occurError() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },

  checkOrder(number) {
    if (number === this.order) {
      return;
    }
    if (number < this.order) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
