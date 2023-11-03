import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

final String assetName = 'Resource_UI_Ico/1x/NSMusicS.svg';
final Widget svg = SvgPicture.asset(
    assetName,
    semanticsLabel: 'Acme Logo'
);