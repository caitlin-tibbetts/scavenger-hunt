import React from "react";
import { Container, Col, Row } from "react-bootstrap";

function ScoreCard(props) {
  return (
    <Container fluid className="score-card">
      <Row>
        <Col xs={2} sm={2}>
          <h2>{props.index}.</h2>
        </Col>
        <Col xs={8} sm={8}>
          <h2>{props.teamName}</h2>
        </Col>
        <Col xs={2} sm={2} style={{ textAlign: "right" }}>
          <h2>{Math.round(props.points)}</h2>
        </Col>
      </Row>
    </Container>
  );
}

export default ScoreCard;
