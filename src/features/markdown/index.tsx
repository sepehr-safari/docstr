import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  DiffSourceToggleWrapper,
  InsertTable,
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import { RefObject } from 'react';

import { useTheme } from '@/shared/components/theme-provider';

import { cn } from '@/shared/utils';

import '@mdxeditor/editor/style.css';

const plugins = {
  toolbar: toolbarPlugin({
    toolbarContents: () => (
      <DiffSourceToggleWrapper>
        <UndoRedo />
        <BoldItalicUnderlineToggles />
        <BlockTypeSelect />
        <CodeToggle />
        <InsertTable />
      </DiffSourceToggleWrapper>
    ),
  }),
  rest: (diffMarkdown: string) => [
    listsPlugin(),
    quotePlugin(),
    headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
    tablePlugin(),
    thematicBreakPlugin(),
    codeBlockPlugin(),
    codeMirrorPlugin({
      codeBlockLanguages: { js: 'JavaScript', py: 'Python', ts: 'TypeScript', txt: 'text' },
    }),
    diffSourcePlugin({ diffMarkdown }),
    markdownShortcutPlugin(),
  ],
};

export const Markdown = ({
  markdownRef,
  markdown = '',
  readonly = false,
  hideToolbar = false,
}: {
  markdownRef: RefObject<MDXEditorMethods>;
  markdown?: string;
  readonly?: boolean;
  hideToolbar?: boolean;
}) => {
  const { theme } = useTheme();

  return (
    <>
      <MDXEditor
        ref={markdownRef}
        readOnly={readonly}
        className={cn('border rounded-md', theme === 'dark' && 'dark-theme dark-editor')}
        markdown={markdown}
        plugins={
          hideToolbar ? plugins.rest(markdown) : [plugins.toolbar, ...plugins.rest(markdown)]
        }
      />
    </>
  );
};
