import React from 'react';
import { IonLifeCycleContext, DefaultIonLifeCycleContext } from './navigation/IonLifeCycleContext';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface InternalProps extends React.HTMLAttributes<HTMLDivElement> {
  forwardedRef?: React.RefObject<HTMLDivElement>,
  activateView?: any;
};

type ExternalProps = Props & {
  ref?: React.RefObject<HTMLDivElement>
  activateView?: any;
};

interface StackItemState {
  ref: any;
}

class StackItem extends React.Component<InternalProps, StackItemState> {
  ionLifeCycleContext = new DefaultIonLifeCycleContext();

  constructor(props: InternalProps) {
    super(props);
    this.state = {
      ref: null
    }
  }

  componentDidMount() {
    const { forwardedRef, activateView } = this.props;
    this.setState({ ref: forwardedRef });
    if (forwardedRef && forwardedRef.current) {
      forwardedRef.current.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      forwardedRef.current.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      forwardedRef.current.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      forwardedRef.current.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
      if (activateView) {
        activateView(forwardedRef.current);
      }
    }
  }

  componentWillUpdate() {

  }

  componentWillUnmount() {
    const { forwardedRef } = this.props;
    if (forwardedRef && forwardedRef.current) {
      forwardedRef.current.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      forwardedRef.current.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      forwardedRef.current.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      forwardedRef.current.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
    }
  }

  ionViewWillEnterHandler() {
    this.ionLifeCycleContext.ionViewWillEnter();
  }

  ionViewDidEnterHandler() {
    this.ionLifeCycleContext.ionViewDidEnter();
  }

  ionViewWillLeaveHandler() {
    this.ionLifeCycleContext.ionViewWillLeave();
  }

  ionViewDidLeaveHandler() {
    this.ionLifeCycleContext.ionViewDidLeave();
  }

  render() {
    const { className, children, forwardedRef, activateView, ...rest } = this.props;
    const { ref } = this.state;
    return (
      <IonLifeCycleContext.Provider value={this.ionLifeCycleContext}>
        <div
          className={className ? `ion-page ${className}` : 'ion-page'}
          ref={forwardedRef}
          {...rest}
        >
          {ref && children}
        </div>
      </IonLifeCycleContext.Provider>
    )
  }
}
StackItem.contextType = IonLifeCycleContext;

function forwardRef(props: InternalProps, ref: React.RefObject<HTMLDivElement>) {
  return <StackItem forwardedRef={ref} {...props} />;
}
forwardRef.displayName = 'StackItem';

export default React.forwardRef<HTMLDivElement, ExternalProps>(forwardRef);