import { useState } from "react";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Form,
  Alert,
} from "react-bootstrap";
import {
  PageTableEntry,
  Frame,
  LRUQueue,
  handlePageRequest,
} from "../utils/MemoryManager";

const MemoryManager = () => {
  const initialPageTable = Array.from(
    { length: 10 },
    (_, i) => new PageTableEntry(i)
  );
  const initialFrames = Array.from({ length: 2 }, (_, i) => new Frame(i));

  const [, setPageTable] = useState(initialPageTable);
  const [frames, setFrames] = useState(initialFrames);
  const [accessSequence, setAccessSequence] = useState([]);
  const [pageFaults, setPageFaults] = useState([]);
  const [replacedPages, setReplacedPages] = useState([]);
  const [inputSequence, setInputSequence] = useState("");
  const [frameCount, setFrameCount] = useState(2);
  const [alertMessage, setAlertMessage] = useState("");
  const [framesHistory, setFramesHistory] = useState([]);

  const handleSequenceChange = (e) => {
    setInputSequence(e.target.value);
  };

  const handleFrameCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value <= 0) {
      setAlertMessage("页帧数量必须是一个正整数");
    } else {
      setAlertMessage("");
      setFrameCount(value);
    }
  };

  const handleProcessSequence = () => {
    if (frameCount <= 0) {
      setAlertMessage("页帧数量必须是一个正整数");
      return;
    }

    const sequence = inputSequence
      .split(",")
      .map((num) => parseInt(num.trim(), 10));
    if (sequence.some(isNaN)) {
      setAlertMessage("页面访问序列必须是有效的数值");
      return;
    }

    const newAccessSequence = [];
    const newPageFaults = [];
    const newReplacedPages = [];
    const newFrames = Array.from(
      { length: frameCount },
      (_, i) => new Frame(i)
    );
    const newPageTable = Array.from(
      { length: 10 },
      (_, i) => new PageTableEntry(i)
    );
    const lruQueue = new LRUQueue(); // 每次处理新序列时重置LRUQueue实例

    const framesHistory = [];

    sequence.forEach((pageNumber) => {
      const { pageFault, replacedPage } = handlePageRequest(
        pageNumber,
        newPageTable,
        newFrames,
        lruQueue
      );
      newAccessSequence.push(pageNumber);
      newPageFaults.push(pageFault);
      newReplacedPages.push(replacedPage);

      // 记录当前帧的状态
      framesHistory.push(newFrames.map((frame) => ({ ...frame })));
    });

    setAccessSequence(newAccessSequence);
    setPageFaults(newPageFaults);
    setReplacedPages(newReplacedPages);
    setPageTable(newPageTable);
    setFrames(newFrames);
    setFramesHistory(framesHistory); // 保存帧的历史状态
  };

  const generateRandomSequence = () => {
    const length = Math.floor(Math.random() * 10) + 5; // 生成长度在5到15之间的随机序列
    const sequence = Array.from({ length }, () =>
      Math.floor(Math.random() * 10)
    ); // 页号在0到9之间
    setInputSequence(sequence.join(", "));
  };

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1 className="text-center">页面内存管理模拟器</h1>
          <p className="text-center">
            这个模拟器帮助你理解页面置换算法。你可以输入一个页面访问序列和页帧数量，点击“开始”按钮，查看每一步的页面访问情况。
          </p>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={8} className="d-flex justify-content-center">
          <Form.Control
            type="text"
            placeholder="输入页面访问序列（例如：1, 2, 3, 2, 1）"
            value={inputSequence}
            onChange={handleSequenceChange}
            aria-label="输入页面访问序列"
            className="mr-2"
          />
        </Col>
        <Col md={4} className="d-flex justify-content-center">
          <Button
            variant="primary"
            onClick={handleProcessSequence}
            className="mr-2"
          >
            开始
          </Button>
          <Button variant="secondary" onClick={generateRandomSequence}>
            生成随机序列
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={2} className="d-flex justify-content-center">
          <Form.Control
            type="number"
            placeholder="页帧数量"
            value={frameCount}
            onChange={handleFrameCountChange}
            aria-label="页帧数量"
            className="mr-2"
          />
        </Col>
      </Row>
      {alertMessage && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" className="text-center">
              {alertMessage}
            </Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>访问序列</th>
                {accessSequence.map((_, index) => (
                  <th key={index}>{index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {frames.map((frame, frameIndex) => (
                <tr key={frame.frameNumber}>
                  <td>页帧 {frame.frameNumber + 1}</td>
                  {framesHistory.map((frameState, index) => {
                    const frameContent = frameState[frameIndex].pageNumber;
                    return (
                      <td key={index}>
                        {frameContent !== null ? frameContent : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td>缺页中断</td>
                {pageFaults.map((fault, index) => (
                  <td key={index}>{fault ? "是" : "否"}</td>
                ))}
              </tr>
              <tr>
                <td>替换页面</td>
                {replacedPages.map((replacedPage, index) => (
                  <td key={index}>
                    {replacedPage !== null ? replacedPage : "无"}
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default MemoryManager;
