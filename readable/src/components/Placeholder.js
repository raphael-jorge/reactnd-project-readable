import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente que impede a renderização do componente filho enquanto
 * ele ainda não está totalmente pronto para ser renderizado. Pode
 * receber um componente fallback, que será renderizado no lugar do
 * componente filho enquanto ele não estiver pronto, e um parâmetro
 * de delay, determinando um tempo mínimo a esperar para renderizar
 * o componente fallback.
 */
export default class Placeholder extends PureComponent {
  static propTypes = {
    isReady: PropTypes.bool.isRequired,
    fallback: PropTypes.element,
    delay: PropTypes.number,
  }

  state = {
    hideFallback: false,
  }

  timeoutId = null
  shouldSetDelayedRender = false

  componentWillMount() {
    const { fallback, delay } = this.props;
    if (fallback && delay) {
      this.shouldSetDelayedRender = true;
    }
  }

  componentDidMount() {
    if (this.shouldSetDelayedRender) {
      this.setDelayedFallbackRender();
      this.shouldSetDelayedRender = false;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.delay && nextProps.fallback && this.props.isReady && !nextProps.isReady) {
      this.shouldSetDelayedRender = true;
    }
  }

  componentDidUpdate() {
    if (this.shouldSetDelayedRender) {
      this.setDelayedFallbackRender();
      this.shouldSetDelayedRender = false;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  /**
   * Ajusta o componente de forma que o componente fallback seja renderizado
   * após o período de tempo especificado na propriedade delay.
   */
  setDelayedFallbackRender() {
    clearTimeout(this.timeoutId);

    const delay = this.props.delay;
    this.setState({ hideFallback: true });

    this.timeoutId = setTimeout(() => {
      this.setState({ hideFallback: false });
      this.timeoutId = null;
    }, delay);
  }

  render() {
    const {
      isReady,
      fallback,
      children,
    } = this.props;

    return (
      <div>
        {isReady &&
          children
        }

        {!isReady && this.state.hideFallback &&
          null
        }

        {!isReady && !this.state.hideFallback &&
          (fallback || null)
        }
      </div>
    );
  }
}
