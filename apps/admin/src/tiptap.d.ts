declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageAlign: {
      setImageAlign: (align: 'left' | 'center' | 'right') => ReturnType
    }
  }
}
