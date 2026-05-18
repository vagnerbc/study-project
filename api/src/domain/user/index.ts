export class User {
  private _name: string;
  private _password?: string | undefined;

  constructor(name: string);
  constructor(name: string, password: string);
  constructor(name: string, password?: string) {
    this._name = name;
    this._password = password;
  }

  public get name() {
    return this._name;
  }

  public getPassword() {
    return this._password;
  }
}
