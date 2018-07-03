/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  history,
  fromQuery,
  toQuery,
  legacyEncodeURIComponent
} from '../../../utils/url';
import { Typeahead } from './Typeahead';
import { getAPMIndexPattern } from '../../../services/rest';
import { convertKueryToEsQuery, getSuggestions } from '../../../services/kuery';
import styled from 'styled-components';
import { getBoolFilter } from './get_bool_filter';

const Container = styled.div`
  margin-bottom: 10px;
`;

class KueryBarView extends Component {
  state = {
    indexPattern: null,
    suggestions: [],
    isLoading: false
  };

  async componentDidMount() {
    const indexPattern = await getAPMIndexPattern();
    this.setState({ indexPattern });
  }

  onChange = async (inputValue, selectionStart) => {
    const { indexPattern } = this.state;
    const { urlParams } = this.props;
    if (!indexPattern) {
      return;
    }
    this.setState({ suggestions: [], isLoading: true });

    const boolFilter = getBoolFilter(urlParams);
    const suggestions = await getSuggestions(
      inputValue,
      selectionStart,
      indexPattern,
      boolFilter
    );
    this.setState({ suggestions, isLoading: false });
  };

  onSubmit = inputValue => {
    const { indexPattern } = this.state;
    if (!indexPattern) {
      return;
    }

    const { location } = this.props;
    try {
      const res = convertKueryToEsQuery(inputValue, indexPattern);
      if (!res) {
        return;
      }

      history.replace({
        ...location,
        search: fromQuery({
          ...toQuery(this.props.location.search),
          kuery: legacyEncodeURIComponent(inputValue.trim())
        })
      });
    } catch (e) {
      console.log('Invalid kuery syntax'); // eslint-disable-line no-console
    }
  };

  render() {
    return (
      <Container>
        <Typeahead
          initialValue={this.props.urlParams.kuery}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          suggestions={this.state.suggestions}
        />
      </Container>
    );
  }
}

KueryBarView.propTypes = {
  location: PropTypes.object.isRequired,
  urlParams: PropTypes.object.isRequired
};

export default KueryBarView;
