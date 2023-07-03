import React from 'react';
import type {EcoToken} from '../../../modules/eco-doc-mark/eco-doc-mark';
import {EcoDocMark} from '../../../modules/eco-doc-mark/eco-doc-mark';

interface Props {
  doc: string;
}

export default function Preview({doc}: Props) {
  const token: EcoToken = EcoDocMark.Parse(doc);
  console.log(token);
  return <div className="bg-white text-black w-1/3 p-1" />;
}
