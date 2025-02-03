import React, { useState } from 'react';
import { AiOutlineFolder, AiOutlineFile } from 'react-icons/ai';

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={handleToggle} style={{ cursor: 'pointer' }}>
        {node.children && (
          <span>{isOpen ? <AiOutlineFolder /> : <AiOutlineFolder />}</span>
        )}
        {!node.children && <AiOutlineFile />}
        {node.label}
      </div>
      {isOpen && node.children && (
        <ul style={{ listStyleType: 'none', marginLeft: '20px' }}>
          {node.children.map((child, index) => (
            <li key={index}>
              <TreeNode node={child} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SidebarTree = () => {
  const treeData = [
    {
      label: 'Folder 1',
      children: [
        { label: 'File 1.1' },
        { label: 'File 1.2' },
      ],
    },
    {
      label: 'Folder 2',
      children: [
        { label: 'File 2.1' },
        {
          label: 'Subfolder 2.2',
          children: [
            { label: 'File 2.2.1' },
            { label: 'File 2.2.2' },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      {treeData.map((node, index) => (
        <TreeNode key={index} node={node} />
      ))}
    </div>
  );
};

export default SidebarTree;
