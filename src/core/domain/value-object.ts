interface ValueObjectProps {
  [value: string]: any;
}

export abstract class ValueObject<Props extends ValueObjectProps> {
  protected readonly _props: Props;

  constructor(props: Props) {
    this._props = props;
  }
}
