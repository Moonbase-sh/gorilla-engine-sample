import * as React from 'react';

const FONT_MEDIUM = 'fonts/Roboto-Medium.otf';
const FONT_BOLD = 'fonts/Roboto-Bold.otf';
const FONT_REGULAR = 'fonts/Roboto-Regular.otf';

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
  stack: string;
};

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  declare state: ErrorBoundaryState;

  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '', stack: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message || String(error) };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      message: error.message || String(error),
      stack: errorInfo.componentStack || error.stack || '',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <geLabel x={0} y={0} width={920} height={590} backgroundColor="17191F">
          <geLabel x={0} y={0} width={8} height={590} backgroundColor="E85D5D" />
          <geLabel x={8} y={0} width={912} height={72} backgroundColor="20232B">
            <geLabel
              x={32}
              y={18}
              width={38}
              height={38}
              backgroundColor="E85D5D"
              text="!"
              textColor="FFFFFF"
              font={FONT_BOLD}
              fontSize={24}
              textAlign="center"
            />
            <geLabel
              x={86}
              y={24}
              width={420}
              height={24}
              text="PLUGIN UI INTERRUPTED"
              textColor="F4F6FA"
              font={FONT_BOLD}
              fontSize={20}
            />
            <geLabel
              x={748}
              y={25}
              width={132}
              height={20}
              text="RENDER ERROR"
              textColor="E85D5D"
              font={FONT_MEDIUM}
              fontSize={11}
              textAlign="center"
              backgroundColor="33262A"
            />
          </geLabel>

          <geLabel
            x={40}
            y={104}
            width={840}
            height={18}
            text="WHAT HAPPENED"
            textColor="7E8797"
            font={FONT_MEDIUM}
            fontSize={11}
          />
          <geLabel
            x={40}
            y={128}
            width={840}
            height={76}
            text={this.state.message || 'An unexpected rendering error occurred.'}
            textColor="F4F6FA"
            font={FONT_MEDIUM}
            fontSize={16}
            backgroundColor="242730"
          />

          <geLabel x={40} y={226} width={840} height={1} backgroundColor="353945" />
          <geLabel
            x={40}
            y={246}
            width={840}
            height={18}
            text="COMPONENT TRACE"
            textColor="7E8797"
            font={FONT_MEDIUM}
            fontSize={11}
          />
          <geLabel
            x={40}
            y={274}
            width={840}
            height={236}
            text={this.state.stack || 'No component trace was provided.'}
            textColor="B9C1CF"
            font={FONT_REGULAR}
            fontSize={11}
            textAlign="left"
            backgroundColor="111319"
          />

          <geLabel x={40} y={536} width={840} height={1} backgroundColor="353945" />
          <geLabel
            x={748}
            y={552}
            width={132}
            height={18}
            text="GORILLA ENGINE"
            textColor="596171"
            font={FONT_MEDIUM}
            fontSize={10}
            textAlign="right"
          />
        </geLabel>
      );
    }

    return (this.props as any).children;
  }
}
