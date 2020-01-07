import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import axios from "axios";
import {base_url} from "../config";
import {Button, Divider, Form, Input, Modal, Table} from "antd";

class Review extends Component {

    constructor(props){
        super(props);


        this.state = {
            review: [],
            visible: false,
            loading: false,
            title: '',
            name: '',
            position: '',
            edittitle: '',
            editname: '',
            editposition: '',
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
            title: '',
            name: '',
            position: ''
        });
    };

    getData = e => {
        axios.get(`${base_url}/review/get.php`).then(res=> {
            this.setState({review: res.data });
        })
    }

    handleDelete = id => {
        axios.get(`${base_url}/review/delete.php?id=${id}`).then(res=>{
            this.getData();
        }).catch(err=>{
            alert(err);
        })
    }

    handleOk = e => {
        if(this.state.title.length > 0&&
            this.state.name.length>0 &&
            this.state.position.length>0) {
            axios.post(`${base_url}/review/save.php`, {
                title: this.state.title,
                name: this.state.name,
                position: this.state.position
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
        if(this.state.edittitle.length > 0&&
            this.state.editname.length>0 &&
            this.state.editposition.length>0) {
            axios.post(`${base_url}/review/update.php`, {
                title: this.state.edittitle,
                name: this.state.editname,
               position: this.state.editposition,
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
            edittitle: item.title,
            editname: item.name,
            editposition: item.position
        })
        console.log(item);
    }


    render (){

        const data = this.state.review.map((item, i)=>{
            return {
                ...item,
                key: i
            }
        });

        const {visible, loading, editvisible } = this.state;



        const columns = [

            {
                title: 'Название',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: 'Имя',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Должность',
                dataIndex: 'position',
                key: 'position'
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
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Создать Отзыв</Button>
                <Modal
                    visible={visible}
                    title="Создать Новый Отзыв"
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
                        <Form.Item label="Назваение">
                            <Input placeholder="Введите новое название" onChange={this.onChange} name="title" value={this.state.title}/>
                        </Form.Item>
                        <Form.Item label="Имя">
                            <Input placeholder="Введите новое имя" onChange={this.onChange} name="name" value={this.state.name}/>
                        </Form.Item>
                        <Form.Item label="Должность">
                            <Input placeholder="Введите новую должность" onChange={this.onChange} name="position" value={this.state.position}/>
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
                        <Form.Item label="Назваение">
                            <Input placeholder="Введите новое название" onChange={this.onChange} name="edittitle" value={this.state.edittitle}/>
                        </Form.Item>
                        <Form.Item label="Имя">
                            <Input placeholder="Введите новое имя" onChange={this.onChange} name="editname" value={this.state.editname}/>
                        </Form.Item>
                        <Form.Item label="Должность">
                            <Input placeholder="Введите новую должность" onChange={this.onChange} name="editposition" value={this.state.editposition}/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Table columns={columns} dataSource={data} />


            </div>
        )

    }
}
Review.propTypes = {
}

export default withRouter(Review);