import React, {Component} from 'react';
import {Button, StyleSheet, View} from 'react-native';

type State<P> = P & {
  visible: boolean;
};

 class ModalBaseScene<P extends object = {}> extends Component<
  any,
  State<P>
> {

  renderModal(): React.ReactElement<any>;
  constructor(props, state?: P) {
    super(props);
    this.state = {
      ...state,
      visible: props.requestEditChat,
    };
  }

  open = () => this.setState({visible: true} as any);
  close = () => this.setState({visible: false} as any);
  isVisible = () => this.state.visible;

  public renderButton(): React.ReactElement<any> {
    return (
      <Button testID={'modal-open-button'} onPress={this.open} title="Openi" />
    );
  }

  render() {
    return <>{this.renderModal()}</>
  }
}

const styles = StyleSheet.create({});

export default ModalBaseScene;
