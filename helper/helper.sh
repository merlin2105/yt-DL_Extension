#!/bin/bash
unset LD_PRELOAD
unset VIVALDI_PRELOADS
export GLIBC_TUNABLES="glibc.cpu.hwcaps=-AVX2_Usable,-AVX_Usable,-AVX_Fast_Unaligned_Load,-SSE4_2_Usable"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export LD_LIBRARY_PATH="$DIR/../../ffmpeg/lib:$LD_LIBRARY_PATH"
exec node "$DIR/helper.js" "$@"
