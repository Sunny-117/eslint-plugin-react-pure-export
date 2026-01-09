// 这个例子为什么没检查出来tsx里面导出的函数或者变量，好像getConfigFromDataSource的调用导致了无法识别了，帮我修复，希望能检测出来。

function getConfigFromDataSource(c: any): any {}
export enum CreativeType {
    'IMAGE' = 1,
    'VIDEO' = 2,
}

const CreativeDataSource = [
    [CreativeType.IMAGE, 'IMAGE', '图片'],
    [CreativeType.VIDEO, 'VIDEO', '视频'],
] as const;

export const {
    dataSource: CreativeTypeDataSource,
    nameMapByValue: CreativeTypeNameMapByValue,
} = getConfigFromDataSource(CreativeDataSource);

// 没有检查出来？？
export function withLinter() {
    console.log('with linter')
}
