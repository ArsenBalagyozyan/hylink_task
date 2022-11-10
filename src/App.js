import './App.css';
import 'antd/dist/antd.css';
import {Table, Input, Spin, Button, Col, Row  } from "antd";
import {useEffect, useState} from "react";
import { Octokit } from "octokit"

function App() {
  const { Search } = Input;

  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState('');
  const [expandUserData, setExpandUserData] = useState({});

  const octokit = new Octokit({
    auth: "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"
  });

  const addKeyToData = (data) => {

    return  data.map((current, index) => {

      current.key = current.login + '-' + index;
      return current;

    });

  };

  useEffect(() => {

    (async () => {

      const response = await octokit.request("GET /users", {});

      const mappedData = addKeyToData(response.data);

      setUserData(mappedData)

    })()

  }, []);

  const childColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Repository',
      dataIndex: 'repository',
      key: 'repository',
    },
    {
      title: 'Followers',
      dataIndex: 'followers',
      key: 'followers',
    },
  ];

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: avatar_url => <img  className='avatar' alt={avatar_url} src={avatar_url} />
    },
    {
      title: 'Username',
      dataIndex: 'login',
      key: 'login',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    Table.EXPAND_COLUMN,
    {
      title: 'Option',
      dataIndex: 'option',
      key: 'option',
    },
  ];

  const searchUser = () => {

    (async () => {

      let response = [];

      // if search input is empty need to get initial users data
      if (!search) {

        const users = await octokit.request("GET /users", {});
        response = users?.data;
      }
      else {

        const users = await octokit.request('GET /search/users', {q: search});
        response = users.data.items

      }

      const mappedData = addKeyToData(response);
      setUserData(mappedData);

    })()
  };

  return (
    <div className="App">
      <header className="App-header">
        <Row>
          <Col span={3}>
            <Search
                placeholder="input search text"
                data-testid="user-search"
                onChange={(e) => {

                  setSearch(e.target.value);
                }}
                onSearch={searchUser}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    searchUser()
                  }
                }}
                value={search}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
                dataSource={userData}
                columns={columns}
                expandable={{
                  expandedRowRender: record => {
                    const currentUserData = expandUserData[record.login];
                    if (!currentUserData) {
                      return (<div className='loader'>
                                <Spin />
                              </div>)
                    }

                    const object = {
                      key: currentUserData['name'],
                      name: currentUserData['name'],
                      company: currentUserData['company'],
                      location: currentUserData['location'],
                      repository: currentUserData['public_repos'],
                      followers: currentUserData['followers']
                    };

                    return (<Row>
                              <Col span={20}>
                                <Table
                                dataSource={[object]}
                                columns={childColumns}
                                pagination={false}
                                />
                              </Col>
                            </Row>)
                  },
                  onExpand: async (status, record) => {
                    const response = await octokit.request(`GET /users/{username}`, {username: record.login});
                    setExpandUserData({...expandUserData, [record.login]: response.data})
                  },
                  columnWidth: 250,
                  childrenColumnName: ["option"],
                  defaultExpandedRowKeys: ["option"],
                  expandIcon: ({ expanded, onExpand, record }) => {
                    return (<Button onClick={e => onExpand(record, e)} data-testid="show-more">Show {expanded ? "Less" : "More" }</Button>)
                  }
                }}
            />
          </Col>
        </Row>
      </header>
    </div>
  );
}

export default App;
