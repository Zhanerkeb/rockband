import React, { Component } from 'react'
import {withRouter, Link} from 'react-router-dom';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import axios from 'axios';
import {base_url} from "../config";

class Login extends Component {



    constructor(props){
        super(props);
        this.state = {

        }
    }
    componentDidMount(){

    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('http://localhost:5000/api/users/login', values).then(res=> {
                    console.log(res.data);
                    localStorage.setItem('token', JSON.stringify(res.data.token));
                    if(res.data && res.data.success) {
                        this.props.history.push('/main/articles');
                    } else {
                        alert("Неправильный логин или параль!")
                    }
                })
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='login-page'>

                <Form onSubmit={this.handleSubmit} className="login-form">
                    <h1>Login</h1>
                    <Form.Item>
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Please input your email!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                placeholder="Email"
                                name="email"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                                name="password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                            <Button type="primary" htmlType="submit" block className="login-form-button">
                                Log in
                            </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
Login.propTypes = {
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

export default withRouter(WrappedNormalLoginForm);