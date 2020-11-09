/** @jsx h */
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Content } from '../scenes/content.js';

export default function Scenes() {
  const [isBrowser] = useState(typeof window !== 'undefined');

  return isBrowser ? <Content /> : null;
}
