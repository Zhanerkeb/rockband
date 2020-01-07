import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import {Table, Divider, Button, Modal, Input, Form, message, Icon, Upload, InputNumber, Select} from 'antd';
import MaskedInput from 'antd-mask-input'
import axios from "axios";
import {base_url, img_url} from "../config";
import Highlighter from 'react-highlight-words';

const { TextArea } = Input;
const {Option} = Select;


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

function beforeUpload(file) {
    const isJPEG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';

    if (!(isPNG || isJPEG)) {
        message.error('You can only upload JPG, JPEG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return (isPNG || isJPEG ) && isLt2M;
};

class Articles extends Component {


    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            rock_bands: [],
            albums: [],
            visible: false,
            imageUrl: null,
            loading: false,
            img: null,
            searchText: '',
            filteredInfo: null,
            sortedInfo: null,
            name: '',
            released_date: '',
            lyrics: '',
            duration: '',
            rate: '',
            image: '',
            music_path: '',
            rock_band_id: '',
            album_id: '',

            edit_name: '',
            edit_released_date: '',
            edit_lyrics: '',
            edit_duration: '',
            edit_rate: '',
            edit_image: '',
            edit_music_path: '',
            edit_rock_band_id: '',
            edit_album_id: '',
            editid: '',
            editvisible: false
        }
    }

    componentDidMount() {
        this.getData();
        this.getRockBands();
    }

    showModal = () => {
        this.setState({
            visible: true,

            imageUrl: null,
            name: '',
            released_date: '',
            lyrics: '',
            duration: '',
            rate: '',
            image: '',
            music_path: '',
            rock_band_id: '',
            album_id: '',
            albums: []
        });
    };

    getData = e => {
        let token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${base_url}/songs/full`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.setState({articles: res.data});
        })

    };

    getRockBands = e => {
        let token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${base_url}/rock-bands/with-albums`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.setState({rock_bands: res.data});
            console.log(res.data);
        })
    };

    getAlbums = id => {
        let token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${base_url}/albums/by-rock-band/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.setState({albums: res.data});
        })
    };

    handleDelete = id => {
        let token = JSON.parse(localStorage.getItem('token'));

        axios.delete(`${base_url}/songs/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.getData();
        }).catch(err => {
            alert(err);
        })
    };

    handleOk = e => {
        let token = JSON.parse(localStorage.getItem('token'));

        if (this.state.name.length > 0) {

            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('name', this.state.name);
            fm.append('released_date', this.state.released_date?this.state.released_date:null);
            fm.append('lyrics', this.state.lyrics);
            fm.append('duration', this.state.duration);
            fm.append('rate', this.state.rate);
            fm.append('rock_band_id', this.state.rock_band_id);
            fm.append('album_id', this.state.album_id);

            axios.post(`${base_url}/songs`, fm, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization" : `Bearer ${token}`
                }
            }).then(res => {
                this.setState({
                    visible: false,
                    img: null
                });
                this.getData();
            }).catch(err => {
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
        let token = JSON.parse(localStorage.getItem('token'));


        if (this.state.edit_name.length > 0) {
            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('name', this.state.edit_name);
            fm.append('released_date', this.state.edit_released_date?this.state.edit_released_date:null);
            fm.append('lyrics', this.state.edit_lyrics);
            fm.append('duration', this.state.edit_duration);
            fm.append('rate', this.state.edit_rate);
            fm.append('rock_band_id', this.state.edit_rock_band_id);
            fm.append('album_id', this.state.edit_album_id);


            axios.put(`${base_url}/songs/${this.state.editid}`, fm,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization" : `Bearer ${token}`
                }
            }).then(res => {
                this.setState({
                    editvisible: false,
                    img: null
                });
                this.getData();
            }).catch(err => {
                alert(err);
            })

        }
    };

    handleEditCancel = e => {
        this.setState({
            editvisible: false,
        });
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onNumberChange = name => value => {
        this.setState({
            [name]: value
        });
    };

    onChangeSelect = (value) => {
        this.setState({
            rock_band_id: value
        });

        if(this.state.rock_band_id !== value) {
            this.setState({
                album_id: ''
            });
        }

        this.getAlbums(value);
    };

    onChangeSelectUpdate = (value) => {
        this.setState({
            edit_rock_band_id: value
        });

        if(this.state.edit_rock_band_id !== value) {
            this.setState({
                edit_album_id: ''
            });
        }

        this.getAlbums(value);
    };

    onChangeSelectAlbums = (value) => {
        this.setState({
            album_id: value
        });
    };

    onChangeSelectAlbumsUpdate = (value) => {
        this.setState({
            edit_album_id: value
        });
    };

    openEditModal = item => {
        this.setState({
            editvisible: true,
            editid: item.id,
            edit_name: item.name,
            edit_released_date: item.released_date,
            edit_duration: item.duration,
            edit_lyrics: item.lyrics,
            edit_rate: item.rate,
            edit_rock_band_id: item.rock_band_id,
            edit_album_id: item.album_id,
            imageUrl: img_url+'/'+item.image
        });

        if(item.rock_band_id) {
            this.setState({
                albums: this.state.rock_bands.filter(band => band.id === item.rock_band_id)[0].Albums
            });
        }
    };


    handleEditChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ imageLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                    this.setState({
                        imageUrl,
                        upload_img: info.file.originFileObj,
                        imageLoading: false,
                    });

                }
            );
        }
    };

    handleChange = (pagination, filters, sorter) => {
        // console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };


    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ imageLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                    img: info.file.originFileObj
                }),
            );
        }
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text?text.toString():'-'}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        const data = this.state.articles.map((item, i) => {

            // console.log({album});
            return {
                ...item,
                released_date: item.released_date?item.released_date.substr(0, 10).split('-').reverse().join('.'):'',
                rock_band: item.Rock_Band ? item.Rock_Band.name:'',
                album: item.Album ? item.Album.name:'',
                key: i
            }

        });

        const {visible, loading, editvisible, rock_bands, albums} = this.state;

        const uploadButton = (
            <div>
                <Icon type={this.state.imageLoading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;

        const columns = [
            {
                title: 'ID',
                key: 'id',
                dataIndex: 'id',
            },
            {
                title: 'Image',
                key: 'image',
                render: (text, record) => (
                    <span className={'rock-band-image'}>
                      <img width="50px" src={img_url+record.image} alt={record.name}/>
                    </span>
                ),
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Released Date',
                dataIndex: 'released_date',
                key: 'released_date',
                ...this.getColumnSearchProps('released_date'),
            },
            {
                title: 'Lyrics',
                dataIndex: 'lyrics',
                key: 'lyrics',
                ...this.getColumnSearchProps('lyrics'),
            },
            {
                title: 'Duration',
                dataIndex: 'duration',
                key: 'duration',
                ...this.getColumnSearchProps('duration'),
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                ...this.getColumnSearchProps('rate'),
            },
            {
                title: 'Music Path',
                dataIndex: 'music_path',
                key: 'music_path',
                ...this.getColumnSearchProps('music_path'),
            },
            {
                title: 'Rock Band',
                dataIndex: 'rock_band',
                key: 'rock_band',
                ...this.getColumnSearchProps('rock_band'),
            },
            {
                title: 'Album',
                dataIndex: 'album',
                key: 'album',
                ...this.getColumnSearchProps('album'),
            },
            {
                title: 'Actions',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => this.openEditModal(record)}>Edit</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.handleDelete(record.id)}>Delete</a>
                    </span>
                ),
            },
        ];

        let options;

        if (rock_bands && rock_bands.length > 0) {
            options = rock_bands.map((item, i) => (
                <Option value={item.id} key={i}>{item.name}</Option>
            ))
        }

        // console.log(albums);
        let albumOptions;

        if (albums && albums.length > 0) {
            albumOptions = albums.map((item, i) => (
                <Option value={item.id} key={i}>{item.name}</Option>
            ))
        }

        return (
            <div>
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Add Song</Button>
                <Modal
                    visible={visible}
                    title="Add Song"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            Save
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>
                        <Form.Item label="Name">
                            <Input placeholder="Enter name" onChange={this.onChange} name="name"
                                   value={this.state.name}/>
                        </Form.Item>

                        <Form.Item label="Released Date">
                            <MaskedInput placeholder="Enter released date" mask="11.11.1111" onChange={this.onChange} name="released_date"
                                         value={this.state.released_date}/>
                        </Form.Item>
                        <Form.Item label="Duration">
                            <InputNumber placeholder="Enter duration" min={1} max={100} onChange={this.onNumberChange('duration')}
                                   value={this.state.duration}/>
                        </Form.Item>
                        <Form.Item label="Lyrics">
                            <TextArea placeholder="Enter Lyrics"
                                         onChange={this.onChange} name="lyrics"
                                         value={this.state.lyrics}/>
                        </Form.Item>
                        <Form.Item label="Rate">
                            <InputNumber placeholder="Enter rate" min={0} max={5} onChange={this.onNumberChange('rate')}
                                         value={this.state.rate}/>
                        </Form.Item>
                        <Form.Item label="Rock Band">
                            <Select onChange={this.onChangeSelect} name="rock_band_id" value={this.state.rock_band_id}>
                                {options}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Album">
                            <Select onChange={this.onChangeSelectAlbums} name="album_id" value={this.state.album_id}>
                                {albumOptions}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Изображения Предпочитаемый Размер 500х650">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    visible={editvisible}
                    title="Edit Song"
                    onOk={this.handleEditOk}
                    onCancel={this.handleEditCancel}
                    footer={[
                        <Button key="back" onClick={this.handleEditCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleEditOk}>
                            Save
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>
                        <Form.Item label="Name">
                            <Input placeholder="Enter name" onChange={this.onChange} name="edit_name"
                                   value={this.state.edit_name}/>
                        </Form.Item>

                        <Form.Item label="Released Date">
                            <MaskedInput placeholder="Enter released date" mask="11.11.1111" onChange={this.onChange} name="edit_released_date"
                                         value={this.state.edit_released_date}/>
                        </Form.Item>
                        <Form.Item label="Duration">
                            <InputNumber placeholder="Enter duration" min={1} max={200} onChange={this.onNumberChange('edit_duration')}
                                         value={this.state.edit_duration}/>
                        </Form.Item>
                        <Form.Item label="Lyrics">
                            <TextArea placeholder="Enter Lyrics"
                                      onChange={this.onChange} name="edit_lyrics"
                                      value={this.state.edit_lyrics}/>
                        </Form.Item>
                        <Form.Item label="Rate">
                            <InputNumber placeholder="Enter rate" min={0} max={5} onChange={this.onNumberChange('edit_rate')}
                                         value={this.state.edit_rate}/>
                        </Form.Item>
                        <Form.Item label="Rock Band">
                            <Select onChange={this.onChangeSelectUpdate} name="edit_rock_band_id" value={this.state.edit_rock_band_id}>
                                {options}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Album">
                            <Select onChange={this.onChangeSelectAlbumsUpdate} name="edit_album_id" value={this.state.edit_album_id}>
                                {albumOptions}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Image
">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="image" /> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                <Table columns={columns} dataSource={data}/>


            </div>
        )
    }
}

Articles.propTypes = {};
export default withRouter(Articles);