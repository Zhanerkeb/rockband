import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {base_url} from "../config";

import { Table, Divider, Button, Modal, Input, Form } from 'antd';


class Categories extends Component {
    constructor(props){
        super(props);


        this.state = {
            categories: [],
            visible: false,
            loading: false,
            type: '',
            edittype: '',
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
            type: ''
        });
    };

    getData = e => {
        axios.get(`${base_url}/categories/get.php`).then(res=> {
            this.setState({categories: res.data });
        })
    };

    handleDelete = id => {
        axios.get(`${base_url}/categories/delete.php?id=${id}`).then(res=>{
            this.getData();
        }).catch(err=>{
            alert(err);
        })
    };

    handleOk = e => {
        if(this.state.type.length > 0) {
            axios.post(`${base_url}/categories/save.php`, {
                type: this.state.type
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
        if(this.state.edittype.length > 0) {
            axios.post(`${base_url}/categories/update.php`, {
                type: this.state.edittype,
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
            edittype: item.type
        })
        console.log(item);
    }


    render (){

        const data = this.state.categories.map((item, i)=>{
            return {
                ...item,
                key: i
            }
        });

        const {visible, loading, editvisible } = this.state;



        const columns = [
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Категория',
                dataIndex: 'type',
                key: 'type'
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
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Добавить категорию</Button>
                <Modal
                    visible={visible}
                    title="Создать категорию"
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
                        <Form.Item label="Категория">
                            <Input placeholder="Введите название" onChange={this.onChange} name="type" value={this.state.type}/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    visible={editvisible}
                    title="Редактировать категорию"
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
                        <Form.Item label="Категория">
                            <Input placeholder="Введите название" onChange={this.onChange} name="edittype" value={this.state.edittype}/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Table columns={columns} dataSource={data} />


            </div>
        )

    }
}
Categories.propTypes = {
}
export default withRouter(Categories);