import React, { useState, useMemo, useCallback } from 'react';
import { Tree, Input, Button, Row, Col, List, Empty, Card } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';

const { Search } = Input;

interface TreeNodeInterface extends DataNode {
  children?: TreeNodeInterface[];
  checked?: boolean;
  indeterminate?: boolean;
  parent?: TreeNodeInterface;
}

interface CheckedItem {
  key: React.Key;
  title: string;
}

const initialTreeData: TreeNodeInterface[] = [
  {
    title: '电子产品',
    key: '0',
    children: [
      {
        title: '手机',
        key: '0-0',
        children: [
          {
            title: 'iPhone',
            key: '0-0-0',
            children: [
              { title: 'iPhone 12', key: '0-0-0-0' },
              { title: 'iPhone 13', key: '0-0-0-1' },
              { title: 'iPhone 14', key: '0-0-0-2' },
            ],
          },
          {
            title: '安卓手机',
            key: '0-0-1',
            children: [
              { title: '三星 Galaxy', key: '0-0-1-0' },
              { title: '华为 P系列', key: '0-0-1-1' },
              { title: '小米', key: '0-0-1-2' },
            ],
          },
        ],
      },
      {
        title: '电脑',
        key: '0-1',
        children: [
          {
            title: '笔记本',
            key: '0-1-0',
            children: [
              { title: 'MacBook', key: '0-1-0-0' },
              { title: 'ThinkPad', key: '0-1-0-1' },
              { title: '戴尔 XPS', key: '0-1-0-2' },
            ],
          },
          {
            title: '台式机',
            key: '0-1-1',
            children: [
              { title: '游戏电脑', key: '0-1-1-0' },
              { title: '工作站', key: '0-1-1-1' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: '家用电器',
    key: '1',
    children: [
      {
        title: '厨房电器',
        key: '1-0',
        children: [
          { title: '冰箱', key: '1-0-0' },
          { title: '微波炉', key: '1-0-1' },
          { title: '洗碗机', key: '1-0-2' },
        ],
      },
      {
        title: '生活电器',
        key: '1-1',
        children: [
          { title: '洗衣机', key: '1-1-0' },
          { title: '吸尘器', key: '1-1-1' },
          { title: '空调', key: '1-1-2' },
        ],
      },
    ],
  },
  {
    title: '书籍',
    key: '2',
    children: [
      {
        title: '小说',
        key: '2-0',
        children: [
          { title: '科幻小说', key: '2-0-0' },
          { title: '悬疑小说', key: '2-0-1' },
          { title: '言情小说', key: '2-0-2' },
        ],
      },
      {
        title: '非小说类',
        key: '2-1',
        children: [
          { title: '科普读物', key: '2-1-0' },
          { title: '历史书籍', key: '2-1-1' },
          { title: '心理学', key: '2-1-2' },
        ],
      },
    ],
  },
];
const ControlPanel: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNodeInterface[]>(initialTreeData);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const updateTreeData = useCallback((list: TreeNodeInterface[], key: React.Key, checked: boolean): TreeNodeInterface[] => {
    return list.map(node => {
      if (node.key === key) {
        return updateNodeAndChildren(node, checked);
      }
      if (node.children) {
        const newChildren = updateTreeData(node.children, key, checked);
        const { allChecked, someChecked } = checkChildrenStatus(newChildren);
        return {
          ...node,
          children: newChildren,
          checked: allChecked,
          halfChecked: !allChecked && someChecked
        };
      }
      return node;
    });
  }, []);

  const updateNodeAndChildren = (node: TreeNodeInterface, checked: boolean): TreeNodeInterface => {
    const updatedNode = { ...node, checked, halfChecked: false };
    if (node.children) {
      updatedNode.children = node.children.map(child => updateNodeAndChildren(child, checked));
    }
    return updatedNode;
  };

  const checkChildrenStatus = (children: TreeNodeInterface[]) => {
    const checkedCount = children.filter(child => child.checked).length;
    const halfCheckedCount = children.filter(child => child.halfChecked).length;
    return {
      allChecked: checkedCount === children.length,
      someChecked: checkedCount > 0 || halfCheckedCount > 0
    };
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    const key = info.node.key;
    const checked = (checkedKeys as string[]).includes(key.toString());
    const newTreeData = updateTreeData(treeData, key, checked);
    setTreeData(newTreeData);
  };

  const handleDelete = (key: React.Key) => {
    const newTreeData = updateTreeData(treeData, key, false);
    setTreeData(newTreeData);
  };

  const checkedItems = useMemo(() => {
    const getCheckedNodes = (nodes: TreeNodeInterface[]): CheckedItem[] => {
      return nodes.reduce<CheckedItem[]>((acc, node) => {
        if (node.checked && !node.halfChecked) {
          acc.push({ key: node.key, title: node.title as string });
        } else if (node.halfChecked && node.children) {
          acc.push(...getCheckedNodes(node.children));
        }
        return acc;
      }, []);
    };
    return getCheckedNodes(treeData);
  }, [treeData]);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const getFilteredTreeData = useCallback((data: TreeNodeInterface[], searchTerm: string): [TreeNodeInterface[], Set<React.Key>] => {
    const expandedKeysSet = new Set<React.Key>();
    const filteredData = data.reduce<TreeNodeInterface[]>((acc, node) => {
      const nodeTitle = String(node.title);
      const matchIndex = nodeTitle.toLowerCase().indexOf(searchTerm.toLowerCase());

      let newNode: TreeNodeInterface = { ...node };
      let shouldInclude = false;

      if (matchIndex > -1) {
        shouldInclude = true;
        const beforeStr = nodeTitle.substr(0, matchIndex);
        const matchStr = nodeTitle.substr(matchIndex, searchTerm.length);
        const afterStr = nodeTitle.substr(matchIndex + searchTerm.length);
        newNode.title = (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{matchStr}</span>
            {afterStr}
          </span>
        );
        expandedKeysSet.add(node.key);
      }

      if (node.children) {
        const [filteredChildren, childExpandedKeys] = getFilteredTreeData(node.children, searchTerm);
        if (filteredChildren.length > 0) {
          shouldInclude = true;
          newNode.children = filteredChildren;
          expandedKeysSet.add(node.key);
          childExpandedKeys.forEach(key => expandedKeysSet.add(key));
        } else {
          newNode.children = undefined;
        }
      }

      if (shouldInclude) {
        acc.push(newNode);
      }

      return acc;
    }, []);

    return [filteredData, expandedKeysSet];
  }, []);

  const [filteredTreeData, newExpandedKeys] = useMemo(() => {
    if (!searchValue) return [treeData, new Set<React.Key>()];
    return getFilteredTreeData(treeData, searchValue);
  }, [getFilteredTreeData, treeData, searchValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    setAutoExpandParent(true);
    if (value) {
      const [, expandedKeys] = getFilteredTreeData(treeData, value);
      setExpandedKeys([...expandedKeys]);
    } else {
      setExpandedKeys([]);
    }
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card
          title="商品分类"
          extra={
            <Search
              placeholder="搜索"
              onChange={onChange}
              value={searchValue}
              style={{ width: 200 }}
            />
          }
          style={{ height: '100%' }}
        >
          {filteredTreeData.length > 0 ? (
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedItems.map(item => item.key)}
              treeData={filteredTreeData}
              style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
            />
          ) : (
            <Empty description="没有找到匹配的结果" />
          )}
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title="已选择的商品"
          extra={<span>{checkedItems.length} 项已选择</span>}
          style={{ height: '100%' }}
        >
          <List
            dataSource={checkedItems}
            renderItem={(item: CheckedItem) => (
              <List.Item
                actions={[
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item.key)}
                    type="text"
                    danger
                  />
                ]}
              >
                <List.Item.Meta title={item.title} />
              </List.Item>
            )}
            style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ControlPanel;
