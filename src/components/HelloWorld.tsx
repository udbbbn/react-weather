import StoreIndex, { store }  from '../store/index'
import * as React from 'react';
interface HelloProps {
    name: string,
    age: number
}
interface HelloState {
    s_name: string,
    s_age: number
}

export class Hello extends React.Component<HelloProps, HelloState> {
    constructor(props: HelloProps) {
        super(props);
        this.state = {
            s_name: this.props.name,
            s_age: this.props.age
        }

    }

    private onChangeHandle(type: string ,e: React.ChangeEvent<HTMLInputElement>) {
        let text = e.currentTarget.value;
        if (type === 'name') {
            this.setState({
                s_name: text
            })
        } else {
            let number: number = ~~text;
            this.setState({
                s_age: number
            })
        }

    }
    private addStore() {
        store.dispatch({
            type: 'INCREMENT'
        })
    }
    private subStore() {
        store.dispatch({
            type: 'DECREMENT'
        })
    }

    
    render() {
        return (
            <div>
                <div>
                    我是{this.state.s_name}, 今年{this.state.s_age}岁
                </div>
                <div>
                    <label htmlFor="">请输入名字：</label>
                    <input type="text" name="" id="" value={this.state.s_name} 
                    onChange={this.onChangeHandle.bind(this, 'name')} />
                    <label htmlFor="">请输入年龄：</label>
                    <input type="text" name="" id="" value={this.state.s_age} 
                    onChange={this.onChangeHandle.bind(this, 'age')} />
                    <StoreIndex></StoreIndex>
                    <input type="button" value="+" onClick={this.addStore} />
                    <input type="button" value="-" onClick={this.subStore} />
                </div>
            </div>
        )
    }
}