// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type {
  BaseTranslation as BaseTranslationType,
  LocalizedString,
} from "typesafe-i18n";

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = "en";

export type Locales = "en" | "ja";

export type Translation = RootTranslation;

export type Translations = RootTranslation;

type RootTranslation = {
  /**
   * H​e​l​l​o​ ​W​o​r​l​d
   */
  hello: string;
  /**
   * M​a​s​a​k​i​ ​Y​o​s​h​i​i​w​a
   */
  name: string;
  /**
   * S​o​f​t​w​a​r​e​ ​d​e​v​e​l​o​p​e​r​,​ ​f​u​l​l​ ​s​t​a​c​k​ ​d​e​v​e​l​o​p​e​r​,​ ​l​o​v​e​ ​f​r​o​n​t​-​e​n​d​ ​d​e​v​e​l​o​p​m​e​n​t​.
   */
  job: string;
  /**
   * P​a​s​s​i​o​n​a​t​e​ ​a​b​o​u​t​ ​s​o​l​v​i​n​g​ ​i​n​t​e​r​e​s​t​i​n​g​ ​p​r​o​b​l​e​m​s​,​ ​a​n​d​ ​f​i​n​d​i​n​g​ ​n​e​w​ ​t​e​c​h​n​o​l​o​g​i​e​s​ ​t​o​ ​l​e​a​r​n​.
   */
  introduce: string;
  /**
   * h​t​t​p​s​:​/​/​g​i​t​h​u​b​.​c​o​m​/​q​l​a​w​m​a​r​q​/​r​e​j​u​m​e​/​b​l​o​b​/​m​a​s​t​e​r​/​M​a​s​a​k​i​Y​o​s​h​i​i​w​a​_​r​e​j​u​m​e​.​p​d​f
   */
  rejumeUrl: string;
};

export type TranslationFunctions = {
  /**
   * Hello World
   */
  hello: () => LocalizedString;
  /**
   * Masaki Yoshiiwa
   */
  name: () => LocalizedString;
  /**
   * Software developer, full stack developer, love front-end development.
   */
  job: () => LocalizedString;
  /**
   * Passionate about solving interesting problems, and finding new technologies to learn.
   */
  introduce: () => LocalizedString;
  /**
   * https://github.com/qlawmarq/rejume/blob/master/MasakiYoshiiwa_rejume.pdf
   */
  rejumeUrl: () => LocalizedString;
};

export type Formatters = {};
