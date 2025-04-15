import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Link,
  Font,
  StyleSheet
} from '@react-pdf/renderer';

  Font.register({ family: 'Telegraf', src: '/fonts/TelegrafUltraBold.ttf'  });
  Font.register({ family: 'OperatorMono', src: '/fonts/OperatorMonoLight.ttf'  });
  Font.register({ family: 'Lato', fonts: [ { src: '/fonts/LatoRegular.ttf' },
      { src: '/fonts/LatoItalic.ttf' , fontStyle: 'italic' }, { src: '/fonts/LatoBold.ttf' , fontWeight: 'bold' }]  });

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 48,
    fontSize: 10,
    lineHeight: 1.4,
    backgroundColor: '#F5F5F5',
    color: '#1f2122',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Lato',
    position: 'relative',
  },
  h1: { fontSize: 28, paddingBottom: 5, fontWeight: 'bold', textAlign: 'center', display: 'block', lineHeight: 1.25, fontFamily: 'Telegraf' },
  h2: { fontSize: 14, paddingBottom: 4, fontWeight: 'bold', fontFamily: 'Telegraf' },
  h3: { fontSize: 12, paddingBottom: 3, paddingTop: 6, fontWeight: 'bold', fontFamily: 'Telegraf' },
  h4: { fontSize: 10, paddingBottom: 2, paddingTop: 4, fontWeight: 'bold', fontFamily: 'Telegraf' },
  p: { paddingBottom: 4, textAlign: 'justify' },
  ul: { paddingBottom: 4, paddingLeft: 4, display: 'block' },
  ol: { paddingBottom: 4, paddingLeft: 4, display: 'block' },
  li: { paddingBottom: 2, display: 'inline', textAlign: 'justify' },
  nestedList: { paddingLeft: 4 },
  a: { color: '#ff03f0', textDecoration: 'underline', textAlign: 'justify', fontWeight: 'bold' },
  code: { fontFamily: 'OperatorMono', backgroundColor: '#ff03f080', fontSize: 9, lineHeight: 1, paddingHorizontal: 2, display: 'block' },
  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  span: {textAlign: 'justify'},
  hr: {},
  div: {},
  text: {display: 'inline'}
});

// Main Document component built with react-pdf
export default function EbookPDF({ data }) {

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
        return <Text key={key} style={styles.code}> {children} </Text>;
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

  const pageSegments = splitIntoPages(data.body);
  return (
    <Document>
      {pageSegments.map((segment, idx) => {
        if (idx === 0) {
          return (
            <Page
              key={idx}
              size="A5"
              style={{...styles.page, justifyContent: 'center', alignItems: 'center'}}
              wrap
            >
              {segment.map((node, index) => renderNode(node, index))}
            </Page>
          )
        }
        return (
          <Page
            key={idx}
            size="A5"
            style={styles.page}
            wrap
          >
            <Text fixed style={{position: 'absolute', top: 0, left: 0, right: 0, width: '100%', height: 10, backgroundColor: '#1f2122'}}/>
            <Text fixed style={{position: 'absolute', top: 18, left: 0, right: 0, width: '100%', height: 4, backgroundColor: '#1f2122'}}/>

            {segment.map((node, index) => renderNode(node, index))}
              <Text fixed style={{position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 4, backgroundColor: '#ff03f0'}}/>
          </Page>
        )
      })}
    </Document>
  );
};

