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
    // Indica se o componente filho está pronto para ser renderizado
    isReady: PropTypes.bool.isRequired,
    // Componente renderizado no lugar do componente filho indisponível
    fallback: PropTypes.element,
    // Tempo esperado para renderizar o componente fallback
    delay: PropTypes.number,
  }

  /**
   * Os estados do componente.
   * @property {Boolean} hideFallback Inica se o fallback deve ser ocultado ou não.
   */
  state = {
    hideFallback: false,
  }

  timeoutId = null
  shouldSetDelayedRender = false

  /**
   * Quando o componente estiver prestes a ser inserido no DOM, verifica se é
   * necessário configurar a renderização atrasada do componente fallback,
   * verificando se as props fallback e delay estão configuradas. Caso seja
   * necessário, o parâmetro shouldSetDelayedRender será configurado para true.
   */
  componentWillMount() {
    const { fallback, delay } = this.props;
    if (fallback && delay) {
      this.shouldSetDelayedRender = true;
    }
  }

  /**
   * Uma vez que o componente foi inserido no DOM, verifica se o parâmetro
   * shouldSetDelayedRender é true. Caso seja, chama o método setDelayedFallbackRender
   * para configurar a renderização atrasada do fallback.
   */
  componentDidMount() {
    if (this.shouldSetDelayedRender) {
      this.setDelayedFallbackRender();
      this.shouldSetDelayedRender = false;
    }
  }

  /**
  * Quando o componente for receber novas props, verifica se será necessário
  * reconfigurar a renderização atrasada do componente fallback. Para isso,
  * verifica-se a existência nas novas props do fallback e do delay e se o
  * parâmetro isReady passou de true para false. Caso seja necessário, o
  * parâmetro shouldSetDelayedRender será configurado para true.
   * @param {Object} nextProps As novas props que serão recebidas.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.delay && nextProps.fallback && this.props.isReady && !nextProps.isReady) {
      this.shouldSetDelayedRender = true;
    }
  }

  /**
   * Uma vez que o componente foi atualizado, verifica se o parâmetro
   * shouldSetDelayedRender é true. Caso seja, chama o método setDelayedFallbackRender
   * para configurar a renderização atrasada do fallback.
   */
  componentDidUpdate() {
    if (this.shouldSetDelayedRender) {
      this.setDelayedFallbackRender();
      this.shouldSetDelayedRender = false;
    }
  }

  /**
   * Quando o componente estiver prestes a ser removido do DOM finaliza qualquer
   * operação de renderização atrasado do fallback pendente.
   */
  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  /**
   * Ajusta o componente de forma que o componente fallback seja renderizado
   * após o período de tempo especificado na propriedade delay. Renderizações
   * previamente configuradas, porém ainda não executadas, serão canceladas.
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
