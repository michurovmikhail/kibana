/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import Suggestion from './Suggestion';

const List = styled.ul`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  background: #fff;
  z-index: 10;
  top: 50px;
  left: 0;
  max-height: 300px;
  overflow: scroll;
`;

class Suggestions extends Component {
  childNodes = [];

  scrollIntoView = () => {
    const parent = this.parentNode;
    const child = this.childNodes[this.props.index];

    if (this.props.index == null || !parent || !child) {
      return;
    }

    const scrollTop = Math.max(
      Math.min(parent.scrollTop, child.offsetTop),
      child.offsetTop + child.offsetHeight - parent.offsetHeight
    );

    parent.scrollTop = scrollTop;
  };

  componentDidUpdate(prevProps) {
    if (prevProps.index !== this.props.index) {
      this.scrollIntoView();
    }
  }

  render() {
    if (!this.props.show || isEmpty(this.props.suggestions)) {
      return null;
    }

    const suggestions = this.props.suggestions.map((suggestion, index) => {
      const key = suggestion + '_' + index;
      return (
        <Suggestion
          innerRef={node => (this.childNodes[index] = node)}
          selected={index === this.props.index}
          suggestion={suggestion}
          onClick={this.props.onClick}
          onMouseOver={() => this.props.onMouseOver(index)}
          key={key}
        />
      );
    });

    return (
      <List
        innerRef={node => (this.parentNode = node)}
        onMouseLeave={this.props.onMouseLeave}
      >
        {suggestions}
      </List>
    );
  }
}

Suggestions.propTypes = {
  index: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  show: PropTypes.bool,
  suggestions: PropTypes.array.isRequired
};

export default Suggestions;
