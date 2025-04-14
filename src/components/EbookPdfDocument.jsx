import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet
} from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
  },
  h1: { fontSize: 32, marginBottom: 8, fontWeight: 'bold', textAlign: 'center', display: 'block', lineHeight: 1.5 },
  h2: { fontSize: 14, marginBottom: 7, fontWeight: 'bold' },
  h3: { fontSize: 12, marginBottom: 6, fontWeight: 'bold' },
  h4: { fontSize: 10, marginBottom: 5, fontWeight: 'bold' },
  p: { marginBottom: 4, textAlign: 'justify' },
  ul: { marginBottom: 4, paddingLeft: 4, display: 'block' },
  ol: { marginBottom: 4, paddingLeft: 4, display: 'block' },
  li: { marginBottom: 2, display: 'inline', textAlign: 'justify' },
  nestedList: { marginLeft: 4 },
  a: { color: 'blue', textDecoration: 'underline', textAlign: 'justify' },
  code: { fontFamily: 'Courier', backgroundColor: '#f4f4f4', padding: 2, fontSize: 8, borderRadius: 4 },
  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  span: {textAlign: 'justify'},
  hr: {},
  div: {},
  text: {display: 'inline'}
});

// Recursive function to render nodes based on tag names
const renderNode = (node, key) => {
  // If node is plain text, return a Text element if not empty.
  if (typeof node === 'string') {
    if (node.trim() === '') return null;
    return <Text key={key}>{node}</Text>;
  }

  // Special handling for list items.
  if (node.tag === 'li') {
    const textElements = [];
    const nestedElements = [];

    // Split node.children into text (or inline elements) and nested lists.
    if (node.children) {
      node.children.forEach((child, index) => {
        if (typeof child === 'string') {
          textElements.push(child);
        } else if (child.tag === 'ul' || child.tag === 'ol') {
          nestedElements.push(renderNode(child, `${key}-${index}`));
        } else {
          textElements.push(renderNode(child, `${key}-${index}`));
        }
      });
    }

    return (
      <View key={key} style={styles.li}>
        <Text style={styles.text}>• {textElements}</Text>
        {nestedElements.map((nested, idx) => (
          <View key={idx} style={styles.nestedList}>
            {nested}
          </View>
        ))}
      </View>
    );
  }

  // For nodes other than li, render children normally.
  const children = node.children
    ? node.children.map((child, index) => renderNode(child, index))
    : null;

  switch (node.tag) {
    case 'div':
      return <View key={key} style={styles.div}>{children}</View>;
    case 'h1':
      return <Text key={key} style={styles.h1}>{children}</Text>;
    case 'h2':
      return <Text key={key} style={styles.h2}>{children}</Text>;
    case 'h3':
      return <Text key={key} style={styles.h3}>{children}</Text>;
    case 'h4':
      return <Text key={key} style={styles.h4}>{children}</Text>;
    case 'p':
      return <Text key={key} style={styles.p}>{children}</Text>;
    case 'ul':
      return <View key={key} style={styles.ul}>{children}</View>;
    case 'ol':
      return <View key={key} style={styles.ol}>{children}</View>;
    case 'a':
      return (
        <Link
          key={key}
          style={styles.a}
          src={node.props && node.props.href ? node.props.href : '#'}
        >
          {children}
        </Link>
      );
    case 'code':
      return <Text key={key} style={styles.code}>{children}</Text>;
    case 'strong':
      return <Text key={key} style={styles.strong}>{children}</Text>;
    case 'em':
      return <Text key={key} style={styles.em}>{children}</Text>;
    case 'span':
      return <Text key={key} style={styles.span}>{children}</Text>;
    case 'hr':
      return <View key={key} style={styles.hr} />;
    default:
      return <View key={key}>{children}</View>;
  }
};

// Splits the body into page segments based on h2 tags
const splitIntoPages = (node) => {
  if (!node || !node.children) return [[]];
  const segments = [];
  let currentSegment = [];
  node.children.forEach(child => {
    if (typeof child === 'object' && child.tag === 'h2') {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
      currentSegment.push(child);
    } else {
      currentSegment.push(child);
    }
  });
  if (currentSegment.length > 0) segments.push(currentSegment);
  return segments;
};

// Main Document component built with react-pdf
const EbookPDF = ({ data }) => {
  const pageSegments = splitIntoPages(data.body);
  return (
    <Document>
      {pageSegments.map((segment, idx) => (
        <Page
          key={idx}
          size="A5"
          style={
            idx === 0
              ? { ...styles.page, justifyContent: 'center', alignItems: 'center' }
              : styles.page
          }
          wrap
        >
          {segment.map((node, index) => renderNode(node, index))}
        </Page>
      ))}
    </Document>
  );
};

export default EbookPDF;
