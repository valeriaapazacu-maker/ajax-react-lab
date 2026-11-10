import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Spinner } from 'react-bootstrap';
const API = `${process.env.PUBLIC_URL}/hamilton.json`;
const FOTOS = {
  'Alexander Hamilton': 'hamilton.jpg',
  'Aaron Burr': 'burr.jpg',
  'Eliza Schuyler': 'eliza.jpg',
  'Angelica Schuyler': 'angelica.jpg',
  'George Washington': 'washington.jpg',
  'Thomas Jefferson': 'jefferson.jpg',
  'Rey George III': 'george-iii.jpg',
  'Marqués de Lafayette': 'lafayette.jpg',
  'Philip Hamilton': 'philip.jpg',
};
function Foto({ personaje }) {
  const [fallo, setFallo] = useState(false);
  const archivo = FOTOS[personaje];

  if (!archivo || fallo) {
    return <div className="ham-photo ham-photo-empty">★</div>;
  }

  return (
    <img
      className="ham-photo"
      src={`${process.env.PUBLIC_URL}/img/${archivo}`}
      alt={personaje}
      onError={() => setFallo(true)}
    />
  );
}
function HamiltonSearch() {
  const [query, setQuery] = useState('');
  const [acto, setActo] = useState('todos');
  const [personaje, setPersonaje] = useState('todos');
  const [songs, setSongs] = useState([]);
  const [personajes, setPersonajes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(false);
    const timer = setTimeout(() => {
      axios
        .get(API)
        .then((res) => {
          if (ignore) return;
          const all = res.data.canciones;
          const text = query.trim().toLowerCase();

          setTotal(all.length);
          setPersonajes([...new Set(all.map((s) => s.personaje))].sort());
          setSongs(
            all.filter(
              (s) =>
                s.titulo.toLowerCase().includes(text) ||
                s.personaje.toLowerCase().includes(text) ||
                s.resumen.toLowerCase().includes(text)
            )
          );
        })
        .catch((err) => {
          console.error(err);
          if (!ignore) setError(true);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);
  const results = songs
    .filter((s) => acto === 'todos' || s.acto === Number(acto))
    .filter((s) => personaje === 'todos' || s.personaje === personaje)
    .sort((a, b) => a.titulo.localeCompare(b.titulo));
  return (
    <Container className="py-4">
      <div className="ham-hero">
        <div className="ham-stars">★ ★ ★</div>
        <h1 className="ham-title">HAMILTON</h1>
        <p className="ham-subtitle">Un musical americano · Letra y música de Lin-Manuel Miranda</p>
      </div>
      <Row className="ham-filters g-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Busca una canción o un personaje..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={acto} onChange={(e) => setActo(e.target.value)}>
            <option value="todos">Los dos actos</option>
            <option value="1">Acto I</option>
            <option value="2">Acto II</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={personaje} onChange={(e) => setPersonaje(e.target.value)}>
            <option value="todos">Todos los personajes</option>
            {personajes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <p className="ham-count">
        {loading && <Spinner animation="border" size="sm" className="me-2" />}
        Mostrando {results.length} de {total} canciones (orden A-Z)
      </p>
      {error && <p className="ham-error">No se pudo cargar hamilton.json</p>}

      <Row>
        {results.map((s) => (
          <Col key={s.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="ham-card h-100">
              <Foto personaje={s.personaje} />
              <Card.Body>
                <span className="ham-badge">
                  Acto {s.acto === 1 ? 'I' : 'II'} · #{s.numero}
                </span>
                <Card.Title className="ham-song">{s.titulo}</Card.Title>
                <Card.Text>
                  <strong>Personaje destacado:</strong> {s.personaje}
                  <br />
                  <span className="ham-summary">{s.resumen}</span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <p className="ham-footer">★ Música y letra originales de Lin-Manuel Miranda ★</p>
    </Container>
  );
}

export default HamiltonSearch;