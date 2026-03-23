class User {
  private readonly props: any;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  updateName(name: string): User {
    return new User({ ...this.props, name });
  }

  updatePassword(hash: string): User {
    return new User({ ...this.props, passwordHash: hash });
  }
}

module.exports = { User };
