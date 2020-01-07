import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import axios from "axios";
import {base_url} from "../config";
import {Button, Divider, Form, Input, Modal, Table} from "antd";

class Contacts extends Component {

    constructor(props){
        super(props);


        this.state = {
            contacts: [],
            visible: false,
            loading: false,
            phone: '',
            address: '',
            email: '',
            editphone: '',
            editaddress: '',
            editemail: '',
            editid: '',
            editvisible: false
        }
    }
    componentDidMount(){
        this.getData()
    }

    showModal = () => {
        this.setState({
            visible: true,
            phone: '',
            address: '',
            email: ''
        });
    };

    getData = e => {
        axios.get(`${base_url}/contacts/get.php`).then(res=> {
            this.setState({contacts: res.data });
        })
    }

    handleDelete = id => {
        axios.get(`${base_url}/contacts/delete.php?id=${id}`).then(res=>{
            this.getData();
        }).catch(err=>{
            alert(err);
        })
    }

    handleOk = e => {
        if(this.state.phone.length > 0&&
            this.state.address.length>0 &&
            this.state.email.length>0) {
            axios.post(`${base_url}/contacts/save.php`, {
                phone: this.state.phone,
                address: this.state.address,
                email: this.state.email
            }).then(res=>{
                this.setState({
                    visible: false,
                });
                this.getData();
            }).catch(err=>{
                alert(err);
            })

        }
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    handleEditOk = e => {
        console.log(this.state)
        if(this.state.editphone.length > 0&&
            this.state.editaddress.length>0 &&
            this.state.editemail.length>0) {
            axios.post(`${base_url}/contacts/update.php`, {
                phone: this.state.editphone,
                address: this.state.editaddress,
                email: this.state.editemail,
                id: this.state.editid
            }).then(res=>{
                this.setState({
                    editvisible: false,
                });
                this.getData();
            }).catch(err=>{
                alert(err);
            })

        }
    };

    handleEditCancel = e => {
        console.log(e);
        this.setState({
            editvisible: false,
        });
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    openEditModal = item => {
        this.setState({
            editvisible: true,
            editid: item.id,
            editphone: item.phone,
            editaddress: item.address,
            editemail: item.email
        })
        console.log(item);
    }


    render (){

        const data = this.state.contacts.map((item, i)=>{
            return {
                ...item,
                key: i
            }
        });

        const {visible, loading, editvisible } = this.state;



        const columns = [

            {
                title: 'Номер',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Адрес',
                dataIndex: 'address',
                key: 'address'
            },
            {
                title: 'Электронная Почта',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
              <a href="javascript:;" onClick={()=>this.openEditModal(record)}>Редактировать</a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={()=>this.handleDelete(record.id)}>Удалить</a>
            </span>
                ),
            },
        ];
        return(
            <div>
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Создать Новый Контакт</Button>
                <Modal
                    visible={visible}
                    title="Создать Новый Контакт"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Отменить
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            Сохранить
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>
                        <Form.Item label="Номер">
                            <Input placeholder="Введите новый номер" onChange={this.onChange} name="phone" value={this.state.phone}/>
                        </Form.Item>
                        <Form.Item label="Адрес">
                            <Input placeholder="Введите новый адрес" onChange={this.onChange} name="address" value={this.state.address}/>
                        </Form.Item>
                        <Form.Item label="Электронная Почта">
                            <Input placeholder="Введите новую почту" onChange={this.onChange} name="email" value={this.state.email}/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    visible={editvisible}
                    title="Редактировать Контакты"
                    onOk={this.handleEditOk}
                    onCancel={this.handleEditCancel}
                    footer={[
                        <Button key="back" onClick={this.handleEditCancel}>
                            Отменить
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleEditOk}>
                            Сохранить
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>
                        <Form.Item label="Номер">
                            <Input placeholder="Введите новый номер" onChange={this.onChange} name="editphone" value={this.state.editphone}/>
                        </Form.Item>
                        <Form.Item label="Адрес">
                            <Input placeholder="Введите новый адрес" onChange={this.onChange} name="editaddress" value={this.state.editaddress}/>
                        </Form.Item>
                        <Form.Item label="Электронная Почта">
                            <Input placeholder="Введите новую почту" onChange={this.onChange} name="editemail" value={this.state.editemail}/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Table columns={columns} dataSource={data} />


            </div>
        )

    }
}
Contacts.propTypes = {
}
export default withRouter(Contacts);